"use client";

import {
  useState,
  useRef,
  useCallback,
  ReactNode,
  createContext,
  useContext,
  useEffect,
} from "react";
import { SyntaxStatus, ReplOutput, ReplCommand } from "../repl";
import { Mutex, MutexInterface } from "async-mutex";
import { useEmbedContext } from "../embedContext";
import { RuntimeContext } from "../runtime";

const RubyContext = createContext<RuntimeContext>(null!);

export function useRuby(): RuntimeContext {
  const context = useContext(RubyContext);
  if (!context) {
    throw new Error("useRuby must be used within a RubyProvider");
  }
  return context;
}

type MessageToWorker =
  | {
      type: "init";
      payload: {};
    }
  | {
      type: "runRuby";
      payload: { code: string };
    }
  | {
      type: "checkSyntax";
      payload: { code: string };
    }
  | {
      type: "runFile";
      payload: { name: string; files: Record<string, string> };
    };

type MessageFromWorker =
  | { id: number; payload: unknown }
  | { id: number; error: string };

type InitPayloadFromWorker = { success: boolean };
type RunPayloadFromWorker = {
  output: ReplOutput[];
  updatedFiles: [string, string][];
};
type StatusPayloadFromWorker = { status: SyntaxStatus };

export function RubyProvider({ children }: { children: ReactNode }) {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const mutex = useRef<MutexInterface>(new Mutex());
  const { files, writeFile } = useEmbedContext();
  const messageCallbacks = useRef<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<number, [(payload: any) => void, (error: string) => void]>
  >(new Map());
  const nextMessageId = useRef<number>(0);
  const commandHistory = useRef<string[]>([]);

  function postMessage<T>({ type, payload }: MessageToWorker) {
    const id = nextMessageId.current++;
    return new Promise<T>((resolve, reject) => {
      messageCallbacks.current.set(id, [resolve, reject]);
      workerRef.current?.postMessage({ id, type, payload });
    });
  }

  const initializeWorker = useCallback(() => {
    const worker = new Worker("/ruby.worker.js");
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const data = event.data as MessageFromWorker;
      if (messageCallbacks.current.has(data.id)) {
        const [resolve, reject] = messageCallbacks.current.get(data.id)!;
        if ("error" in data) {
          reject(data.error);
        } else {
          resolve(data.payload);
        }
        messageCallbacks.current.delete(data.id);
      }
    };

    return postMessage<InitPayloadFromWorker>({
      type: "init",
      payload: {},
    });
  }, []);

  useEffect(() => {
    initializeWorker().then(({ success }) => {
      if (success) {
        setReady(true);
      }
    });

    return () => {
      workerRef.current?.terminate();
    };
  }, [initializeWorker]);

  const interrupt = useCallback(() => {
    // Terminate the current worker
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // reject all pending messages
    for (const [, [, reject]] of messageCallbacks.current) {
      reject("Execution interrupted");
    }

    // Mark as not ready during reinitialization
    setReady(false);

    void mutex.current.runExclusive(async () => {
      // Reinitialize the worker
      const { success } = await initializeWorker();

      if (success) {
        // Re-execute all saved commands to restore state
        for (const cmd of commandHistory.current) {
          try {
            await postMessage<RunPayloadFromWorker>({
              type: "runRuby",
              payload: { code: cmd },
            });
          } catch (e) {
            console.error("Error restoring command:", cmd, e);
          }
        }
        setReady(true);
      }
    });
  }, [initializeWorker]);

  const runCommand = useCallback(
    async (code: string): Promise<ReplOutput[]> => {
      if (!mutex.current.isLocked()) {
        throw new Error("mutex of RubyContext must be locked for runCommand");
      }
      if (!workerRef.current || !ready) {
        return [{ type: "error", message: "Ruby VM is not ready yet." }];
      }

      const { output, updatedFiles } = await postMessage<RunPayloadFromWorker>({
        type: "runRuby",
        payload: { code },
      }).catch((error) => {
        return {
          output: [
            { type: "error", message: `Execution error: ${error}` },
          ] as ReplOutput[],
          updatedFiles: [] as [string, string][],
        };
      });

      // Check if the command succeeded (no errors)
      const hasError = output.some((o) => o.type === "error");
      if (!hasError) {
        // Save successful command to history
        commandHistory.current.push(code);
      }

      for (const [name, content] of updatedFiles) {
        writeFile(name, content);
      }
      return output;
    },
    [ready, writeFile]
  );

  const checkSyntax = useCallback(
    async (code: string): Promise<SyntaxStatus> => {
      if (!workerRef.current || !ready) return "invalid";
      const { status } = await mutex.current.runExclusive(() =>
        postMessage<StatusPayloadFromWorker>({
          type: "checkSyntax",
          payload: { code },
        })
      );
      return status;
    },
    [ready]
  );

  const runFiles = useCallback(
    async (filenames: string[]): Promise<ReplOutput[]> => {
      if (filenames.length !== 1) {
        return [
          {
            type: "error",
            message: "Ruby execution requires exactly one filename",
          },
        ];
      }
      if (!workerRef.current || !ready) {
        return [{ type: "error", message: "Ruby VM is not ready yet." }];
      }
      return mutex.current.runExclusive(async () => {
        const { output, updatedFiles } =
          await postMessage<RunPayloadFromWorker>({
            type: "runFile",
            payload: { name: filenames[0], files },
          }).catch((error) => {
            return {
              output: [
                { type: "error", message: `Execution error: ${error}` },
              ] as ReplOutput[],
              updatedFiles: [] as [string, string][],
            };
          });
        for (const [newName, content] of updatedFiles) {
          writeFile(newName, content);
        }
        return output;
      });
    },
    [files, ready, writeFile]
  );

  const splitReplExamples = useCallback((content: string): ReplCommand[] => {
    const initCommands: { command: string; output: ReplOutput[] }[] = [];
    for (const line of content.split("\n")) {
      if (line.startsWith(">> ")) {
        // Ruby IRB uses >> as the prompt
        initCommands.push({ command: line.slice(3), output: [] });
      } else if (line.startsWith("?> ")) {
        // Ruby IRB uses ?> for continuation
        if (initCommands.length > 0) {
          initCommands[initCommands.length - 1].command += "\n" + line.slice(3);
        }
      } else {
        // Lines without prompt are output from the previous command
        if (initCommands.length > 0) {
          initCommands[initCommands.length - 1].output.push({
            type: "stdout",
            message: line,
          });
        }
      }
    }
    return initCommands;
  }, []);

  const getCommandlineStr = useCallback(
    (filenames: string[]) => `ruby ${filenames[0]}`,
    []
  );

  return (
    <RubyContext.Provider
      value={{
        ready,
        runCommand,
        checkSyntax,
        mutex: mutex.current,
        runFiles,
        interrupt,
        splitReplExamples,
        getCommandlineStr,
      }}
    >
      {children}
    </RubyContext.Provider>
  );
}
