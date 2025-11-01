"use client";

import {
  Context,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RuntimeContext } from "../runtime";
import { ReplOutput, SyntaxStatus } from "../repl";
import { Mutex, MutexInterface } from "async-mutex";
import { useEmbedContext } from "../embedContext";

type MessageToWorker =
  | { type: "init"; payload: { interruptBuffer: Uint8Array } }
  | { type: "runCode"; payload: { code: string } }
  | { type: "checkSyntax"; payload: { code: string } }
  | {
      type: "runFile";
      payload: { name: string; files: Record<string, string> };
    }
  | { type: "restoreState"; payload: { commands: string[] } };

type MessageFromWorker =
  | { id: number; payload: unknown }
  | { id: number; error: string };

type WorkerCapabilities = {
  interrupt: "buffer" | "restart";
};
type InitPayloadFromWorker = {
  capabilities: WorkerCapabilities;
};
type RunPayloadFromWorker = {
  output: ReplOutput[];
  updatedFiles: [string, string][];
};
type StatusPayloadFromWorker = { status: SyntaxStatus };

export function WorkerProvider({
  children,
  context,
  script,
}: {
  children: ReactNode;
  context: Context<RuntimeContext>;
  script: string;
}) {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const mutex = useRef<MutexInterface>(new Mutex());
  const { files, writeFile } = useEmbedContext();

  const messageCallbacks = useRef<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<number, [(payload: any) => void, (error: string) => void]>
  >(new Map());
  const nextMessageId = useRef<number>(0);

  // Worker-specific state
  const interruptBuffer = useRef<Uint8Array | null>(null);
  const capabilities = useRef<WorkerCapabilities | null>(null);
  const commandHistory = useRef<string[]>([]);

  // Generic postMessage
  function postMessage<T>(message: MessageToWorker) {
    const id = nextMessageId.current++;
    return new Promise<T>((resolve, reject) => {
      messageCallbacks.current.set(id, [resolve, reject]);
      workerRef.current?.postMessage({ id, ...message });
    });
  }

  const initializeWorker = useCallback(async () => {
    const worker = new Worker(script);
    workerRef.current = worker;

    // Always create and provide the buffer
    interruptBuffer.current = new Uint8Array(new SharedArrayBuffer(1));

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
      payload: { interruptBuffer: interruptBuffer.current },
    }).then((payload) => {
      capabilities.current = payload.capabilities;
    });
  }, [script]);

  // Initialization effect
  useEffect(() => {
    initializeWorker().then(() => setReady(true));
    return () => {
      workerRef.current?.terminate();
    };
  }, [initializeWorker]);

  const interrupt = useCallback(() => {
    if (!capabilities.current) return;

    switch (capabilities.current?.interrupt) {
      case "buffer":
        if (interruptBuffer.current) {
          interruptBuffer.current[0] = 2;
        }
        break;
      case "restart": {
        // Reject all pending promises
        const error = "Worker interrupted";
        messageCallbacks.current.forEach(([, reject]) => reject(error));
        messageCallbacks.current.clear();

        workerRef.current?.terminate();
        setReady(false);

        void mutex.current.runExclusive(async () => {
          await initializeWorker();
          if (commandHistory.current.length > 0) {
            await postMessage<object>({
              type: "restoreState",
              payload: { commands: commandHistory.current },
            });
          }
          setReady(true);
        });
        break;
      }
      default:
        capabilities.current?.interrupt satisfies never;
        break;
    }
  }, [initializeWorker]);

  const runCommand = useCallback(
    async (code: string): Promise<ReplOutput[]> => {
      if (!mutex.current.isLocked()) {
        throw new Error(`mutex of context must be locked for runCommand`);
      }
      if (!workerRef.current || !ready) {
        return [
          {
            type: "error",
            message: `worker runtime is not ready yet.`,
          },
        ];
      }

      if (
        capabilities.current?.interrupt === "buffer" &&
        interruptBuffer.current
      ) {
        interruptBuffer.current[0] = 0;
      }

      try {
        const { output, updatedFiles } =
          await postMessage<RunPayloadFromWorker>({
            type: "runCode",
            payload: { code },
          });

        for (const [name, content] of updatedFiles) {
          writeFile(name, content);
        }

        // Save command to history if interrupt method is 'restart'
        if (capabilities.current?.interrupt === "restart") {
          const hasError = output.some((o) => o.type === "error");
          if (!hasError) {
            commandHistory.current.push(code);
          }
        }

        return output;
      } catch (error) {
        if (error instanceof Error) {
          return [{ type: "error", message: error.message }];
        }
        return [{ type: "error", message: String(error) }];
      }
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
            message: `worker runtime requires exactly one filename.`,
          },
        ];
      }
      if (!workerRef.current || !ready) {
        return [
          {
            type: "error",
            message: `worker runtime is not ready yet.`,
          },
        ];
      }
      if (
        capabilities.current?.interrupt === "buffer" &&
        interruptBuffer.current
      ) {
        interruptBuffer.current[0] = 0;
      }
      return mutex.current.runExclusive(async () => {
        const { output, updatedFiles } =
          await postMessage<RunPayloadFromWorker>({
            type: "runFile",
            payload: { name: filenames[0], files },
          });
        for (const [newName, content] of updatedFiles) {
          writeFile(newName, content);
        }
        return output;
      });
    },
    [files, ready, writeFile]
  );

  return (
    <context.Provider
      value={{
        ready,
        runCommand,
        checkSyntax,
        mutex: mutex.current,
        runFiles,
        interrupt,
      }}
    >
      {children}
    </context.Provider>
  );
}
