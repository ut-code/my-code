"use client";

import {
  Context,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RuntimeContext, RuntimeLang } from "../runtime";
import { ReplOutput, SyntaxStatus } from "../repl";
import { Mutex, MutexInterface } from "async-mutex";
import { useEmbedContext } from "../embedContext";

type WorkerLang = "python" | "ruby" | "javascript";
type WorkerCapabilities = {
  interrupt: "buffer" | "restart";
};

export type MessageType = keyof MessagePayload;
export type MessagePayload = {
  init: {
    req: { interruptBuffer: Uint8Array };
    res: { capabilities: WorkerCapabilities };
  };
  runCode: {
    req: { code: string };
    res: { output: ReplOutput[]; updatedFiles: Record<string, string> };
  };
  runFile: {
    req: { name: string; files: Record<string, string> };
    res: { output: ReplOutput[]; updatedFiles: Record<string, string> };
  };
  checkSyntax: {
    req: { code: string };
    res: { status: SyntaxStatus };
  };
  restoreState: {
    req: { commands: string[] };
    res: object;
  };
};
// export type WorkerRequest = { id: number; type: "init"; payload: MessagePayload["init"]["req"]; } | ... と同じ
export type WorkerRequest = {
  [K in MessageType]: {
    id: number;
    type: K;
    payload: MessagePayload[K]["req"];
  };
};
export type WorkerResponse = {
  [K in MessageType]:
    | {
        id: number;
        payload: MessagePayload[MessageType]["res"];
      }
    | { id: number; error: string };
};

export function WorkerProvider({
  children,
  context,
  lang,
}: {
  children: ReactNode;
  context: Context<RuntimeContext>;
  lang: WorkerLang;
}) {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const mutex = useMemo<MutexInterface>(() => new Mutex(), []);
  const { writeFile } = useEmbedContext();

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
  function postMessage<K extends MessageType>(
    type: K,
    payload: MessagePayload[K]["req"]
  ) {
    const id = nextMessageId.current++;
    return new Promise<MessagePayload[K]["res"]>((resolve, reject) => {
      messageCallbacks.current.set(id, [resolve, reject]);
      workerRef.current?.postMessage({ id, type, payload } as WorkerRequest[K]);
    });
  }

  const initializeWorker = useCallback(async () => {
    if (!mutex.isLocked()) {
      throw new Error(`mutex of context must be locked for initializeWorker`);
    }
    if (workerRef.current) {
      return;
    }

    let worker: Worker;
    lang satisfies RuntimeLang;
    switch (lang) {
      case "python":
        worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url));
        break;
      case "ruby":
        worker = new Worker(new URL("./ruby.worker.ts", import.meta.url));
        break;
      case "javascript":
        worker = new Worker(new URL("./jsEval.worker.ts", import.meta.url));
        break;
      default:
        lang satisfies never;
        throw new Error(`Unknown worker language: ${lang}`);
    }
    workerRef.current = worker;

    // Always create and provide the buffer
    interruptBuffer.current = new Uint8Array(new SharedArrayBuffer(1));

    worker.onmessage = (event) => {
      const data = event.data as WorkerResponse[MessageType];
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

    return postMessage("init", {
      interruptBuffer: interruptBuffer.current,
    }).then((payload) => {
      capabilities.current = payload.capabilities;
    });
  }, [lang, mutex]);

  const [doInit, setDoInit] = useState(false);
  const init = useCallback(() => setDoInit(true), []);

  // Initialization effect
  useEffect(() => {
    if (doInit) {
      void mutex.runExclusive(async () => {
        await initializeWorker();
        setReady(true);
      });
      return () => {
        void mutex.runExclusive(async () => {
          workerRef.current?.terminate();
          workerRef.current = null;
        });
      };
    }
  }, [doInit, initializeWorker, mutex]);

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
        workerRef.current = null;
        setReady(false);

        void mutex.runExclusive(async () => {
          await initializeWorker();
          if (commandHistory.current.length > 0) {
            await postMessage("restoreState", {
              commands: commandHistory.current,
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
  }, [initializeWorker, mutex]);

  const runCommand = useCallback(
    async (code: string): Promise<ReplOutput[]> => {
      if (!mutex.isLocked()) {
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
        const { output, updatedFiles } = await postMessage("runCode", { code });

        writeFile(updatedFiles);

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
    [ready, writeFile, mutex]
  );

  const checkSyntax = useCallback(
    async (code: string): Promise<SyntaxStatus> => {
      if (!workerRef.current || !ready) return "invalid";
      const { status } = await mutex.runExclusive(() =>
        postMessage("checkSyntax", { code })
      );
      return status;
    },
    [ready, mutex]
  );

  const runFiles = useCallback(
    async (
      filenames: string[],
      files: Readonly<Record<string, string>>
    ): Promise<ReplOutput[]> => {
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
      return mutex.runExclusive(async () => {
        const { output, updatedFiles } = await postMessage("runFile", {
          name: filenames[0],
          files,
        });
        writeFile(updatedFiles);
        return output;
      });
    },
    [ready, writeFile, mutex]
  );

  return (
    <context.Provider
      value={{
        init,
        ready,
        runCommand,
        checkSyntax,
        mutex,
        runFiles,
        interrupt,
      }}
    >
      {children}
    </context.Provider>
  );
}
