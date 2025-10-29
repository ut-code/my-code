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
import { SyntaxStatus, ReplOutput } from "../repl";
import { Mutex, MutexInterface } from "async-mutex";
import { useEmbedContext } from "../embedContext";

interface IPyodideContext {
  init: () => Promise<void>;
  initializing: boolean;
  ready: boolean;
  mutex: MutexInterface;
  runPython: (code: string) => Promise<ReplOutput[]>;
  runFile: (name: string) => Promise<ReplOutput[]>;
  checkSyntax: (code: string) => Promise<SyntaxStatus>;
  interrupt: () => void;
}

const PyodideContext = createContext<IPyodideContext>(null!);

export function usePyodide() {
  const context = useContext(PyodideContext);
  if (!context) {
    throw new Error("usePyodide must be used within a PyodideProvider");
  }
  return context;
}

type MessageToWorker =
  | {
      type: "init";
      payload: { PYODIDE_CDN: string; interruptBuffer: Uint8Array };
    }
  | {
      type: "runPython";
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
  updatedFiles: [string, string][]; // Recordではない
};
type StatusPayloadFromWorker = { status: SyntaxStatus };

export function PyodideProvider({ children }: { children: ReactNode }) {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const mutex = useRef<MutexInterface>(new Mutex());
  const { files, writeFile } = useEmbedContext();
  const messageCallbacks = useRef<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<number, [(payload: any) => void, (error: string) => void]>
  >(new Map());
  const nextMessageId = useRef<number>(0);
  const interruptBuffer = useRef<Uint8Array | null>(null);

  function postMessage<T>({ type, payload }: MessageToWorker) {
    const id = nextMessageId.current++;
    return new Promise<T>((resolve, reject) => {
      messageCallbacks.current.set(id, [resolve, reject]);
      workerRef.current?.postMessage({ id, type, payload });
    });
  }

  const init = useCallback(async () => {
    if (workerRef.current || initializing) return;

    setInitializing(true);
    const worker = new Worker("/pyodide.worker.js");
    workerRef.current = worker;

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

    // next.config.ts 内でpyodideをimportし、バージョンを取得している
    const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${process.env.PYODIDE_VERSION}/full/`;
    postMessage<InitPayloadFromWorker>({
      type: "init",
      payload: { PYODIDE_CDN, interruptBuffer: interruptBuffer.current },
    }).then(({ success }) => {
      if (success) {
        setReady(true);
      }
      setInitializing(false);
    });
  }, [initializing]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const interrupt = useCallback(() => {
    if (interruptBuffer.current) {
      interruptBuffer.current[0] = 2;
    }
  }, []);

  const runPython = useCallback(
    async (code: string): Promise<ReplOutput[]> => {
      if (!mutex.current.isLocked()) {
        throw new Error("mutex of PyodideContext must be locked for runPython");
      }
      if (!workerRef.current || !ready) {
        return [{ type: "error", message: "Pyodide is not ready yet." }];
      }

      if (interruptBuffer.current) {
        interruptBuffer.current[0] = 0;
      }

      const { output, updatedFiles } = await postMessage<RunPayloadFromWorker>({
        type: "runPython",
        payload: { code },
      });
      for (const [name, content] of updatedFiles) {
        writeFile(name, content);
      }
      return output;
    },
    [ready, writeFile]
  );

  const runFile = useCallback(
    async (name: string): Promise<ReplOutput[]> => {
      if (!workerRef.current || !ready) {
        return [{ type: "error", message: "Pyodide is not ready yet." }];
      }
      if (interruptBuffer.current) {
        interruptBuffer.current[0] = 0;
      }
      return mutex.current.runExclusive(async () => {
        const { output, updatedFiles } =
          await postMessage<RunPayloadFromWorker>({
            type: "runFile",
            payload: { name, files },
          });
        for (const [newName, content] of updatedFiles) {
          writeFile(newName, content);
        }
        return output;
      });
    },
    [files, ready, writeFile]
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

  return (
    <PyodideContext.Provider
      value={{
        init,
        initializing,
        ready,
        runPython,
        checkSyntax,
        mutex: mutex.current,
        runFile,
        interrupt,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
}
