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
import { RuntimeContext } from "../runtime";

const JavaScriptContext = createContext<RuntimeContext>(null!);

export function useJavaScript(): RuntimeContext {
  const context = useContext(JavaScriptContext);
  if (!context) {
    throw new Error("useJavaScript must be used within a JavaScriptProvider");
  }
  return context;
}

type MessageToWorker =
  | {
      type: "init";
    }
  | {
      type: "runJavaScript";
      payload: { code: string };
    }
  | {
      type: "checkSyntax";
      payload: { code: string };
    }
  | {
      type: "restoreState";
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

export function JavaScriptProvider({ children }: { children: ReactNode }) {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const mutex = useRef<MutexInterface>(new Mutex());
  const messageCallbacks = useRef<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<number, [(payload: any) => void, (error: string) => void]>
  >(new Map());
  const nextMessageId = useRef<number>(0);
  const isInterrupted = useRef<boolean>(false);

  function postMessage<T>({ type, payload }: MessageToWorker) {
    const id = nextMessageId.current++;
    return new Promise<T>((resolve, reject) => {
      messageCallbacks.current.set(id, [resolve, reject]);
      workerRef.current?.postMessage({ id, type, payload });
    });
  }

  const initializeWorker = useCallback(() => {
    const worker = new Worker("/javascript.worker.js");
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

    postMessage<InitPayloadFromWorker>({
      type: "init",
    }).then(({ success }) => {
      if (success) {
        setReady(true);
      }
    });

    return worker;
  }, []);

  useEffect(() => {
    const worker = initializeWorker();

    return () => {
      worker.terminate();
    };
  }, [initializeWorker]);

  const interrupt = useCallback(async () => {
    // Since we can't interrupt JavaScript execution directly,
    // we terminate the worker and restart it, then restore state
    isInterrupted.current = true;
    
    // Reject all pending callbacks before terminating
    const error = "Worker interrupted";
    messageCallbacks.current.forEach(([, reject]) => reject(error));
    messageCallbacks.current.clear();
    
    // Terminate the current worker
    workerRef.current?.terminate();
    
    // Reset ready state
    setReady(false);
    
    // Create a new worker
    initializeWorker();
    
    // Wait for initialization with timeout
    const maxRetries = 50; // 5 seconds total
    let retries = 0;
    
    await new Promise<void>((resolve, reject) => {
      const checkInterval = setInterval(() => {
        retries++;
        if (retries > maxRetries) {
          clearInterval(checkInterval);
          reject(new Error("Worker initialization timeout"));
          return;
        }
        
        if (workerRef.current) {
          // Try to restore state
          postMessage<{ success: boolean }>({
            type: "restoreState",
          }).then(() => {
            clearInterval(checkInterval);
            isInterrupted.current = false;
            resolve();
          }).catch(() => {
            // Keep trying
          });
        }
      }, 100);
    });
  }, [initializeWorker]);

  const runCommand = useCallback(
    async (code: string): Promise<ReplOutput[]> => {
      if (!mutex.current.isLocked()) {
        throw new Error(
          "mutex of JavaScriptContext must be locked for runCommand"
        );
      }
      if (!workerRef.current || !ready) {
        return [{ type: "error", message: "JavaScript runtime is not ready yet." }];
      }

      try {
        const { output } = await postMessage<RunPayloadFromWorker>({
          type: "runJavaScript",
          payload: { code },
        });
        return output;
      } catch (error) {
        // If interrupted or worker was terminated, return appropriate message
        if (isInterrupted.current) {
          return [{ type: "error", message: "実行が中断されました" }];
        }
        // Handle other errors
        if (error instanceof Error) {
          return [{ type: "error", message: error.message }];
        }
        return [{ type: "error", message: String(error) }];
      }
    },
    [ready]
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_filenames: string[]): Promise<ReplOutput[]> => {
      return [
        {
          type: "error",
          message: "JavaScript file execution is not supported in this runtime",
        },
      ];
    },
    []
  );

  const splitReplExamples = useCallback((content: string): ReplCommand[] => {
    const initCommands: { command: string; output: ReplOutput[] }[] = [];
    for (const line of content.split("\n")) {
      if (line.startsWith("> ")) {
        // Remove the prompt from the command
        initCommands.push({ command: line.slice(2), output: [] });
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
    (filenames: string[]) => `node ${filenames[0]}`,
    []
  );

  return (
    <JavaScriptContext.Provider
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
    </JavaScriptContext.Provider>
  );
}
