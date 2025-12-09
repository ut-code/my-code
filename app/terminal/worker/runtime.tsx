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
import { wrap, Remote } from "comlink";
import { RuntimeContext, RuntimeLang } from "../runtime";
import { ReplOutput, SyntaxStatus } from "../repl";
import { Mutex, MutexInterface } from "async-mutex";
import { useEmbedContext } from "../embedContext";

type WorkerLang = "python" | "ruby" | "javascript";
export type WorkerCapabilities = {
  interrupt: "buffer" | "restart";
};

// Define the worker API interface
export interface WorkerAPI {
  init(
    interruptBuffer: Uint8Array
  ): Promise<{ capabilities: WorkerCapabilities }>;
  runCode(
    code: string
  ): Promise<{ output: ReplOutput[]; updatedFiles: Record<string, string> }>;
  runFile(
    name: string,
    files: Record<string, string>
  ): Promise<{ output: ReplOutput[]; updatedFiles: Record<string, string> }>;
  checkSyntax(code: string): Promise<{ status: SyntaxStatus }>;
  restoreState(commands: string[]): Promise<object>;
}

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
  const workerApiRef = useRef<Remote<WorkerAPI> | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const mutex = useMemo<MutexInterface>(() => new Mutex(), []);
  const { writeFile } = useEmbedContext();

  // Worker-specific state
  const interruptBuffer = useRef<Uint8Array | null>(null);
  const capabilities = useRef<WorkerCapabilities | null>(null);
  const commandHistory = useRef<string[]>([]);

  // Track pending promises for restart-based interruption
  const pendingPromises = useRef<Set<(reason: unknown) => void>>(new Set());

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

    // Wrap the worker with Comlink
    const workerApi = wrap<WorkerAPI>(worker);
    workerApiRef.current = workerApi;

    // Always create and provide the buffer for Python (others ignore it)
    interruptBuffer.current = new Uint8Array(new SharedArrayBuffer(1));

    const payload = await workerApi.init(interruptBuffer.current);
    capabilities.current = payload.capabilities;
  }, [lang, mutex]);

  const [doInit, setDoInit] = useState(false);
  const init = useCallback(() => setDoInit(true), []);

  // Helper function to wrap worker API calls and track pending promises
  // This ensures promises are rejected when the worker is terminated
  const trackPromise = useCallback(<T,>(promise: Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      // Store the reject function
      pendingPromises.current.add(reject);

      promise.then(resolve, reject).finally(() => {
        // Remove reject function after promise settles
        pendingPromises.current.delete(reject);
      });
    });
  }, []);

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
          setReady(false);
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
        // Reject all pending promises by calling their reject handlers
        const error = new Error("Worker interrupted");
        pendingPromises.current.forEach((reject) => reject(error));
        pendingPromises.current.clear();

        // Terminate the worker
        workerRef.current?.terminate();
        workerRef.current = null;
        workerApiRef.current = null;
        setReady(false);

        void mutex.runExclusive(async () => {
          await initializeWorker();
          if (
            commandHistory.current.length > 0 &&
            workerApiRef.current !== null
          ) {
            await workerApiRef.current.restoreState(commandHistory.current);
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
      if (!workerApiRef.current || !ready) {
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
        const { output, updatedFiles } = await trackPromise(
          workerApiRef.current.runCode(code)
        );

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
    [ready, writeFile, mutex, trackPromise]
  );

  const checkSyntax = useCallback(
    async (code: string): Promise<SyntaxStatus> => {
      if (!workerApiRef.current || !ready) return "invalid";
      const { status } = await mutex.runExclusive(() =>
        trackPromise(workerApiRef.current!.checkSyntax(code))
      );
      return status;
    },
    [ready, mutex, trackPromise]
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
      if (!workerApiRef.current || !ready) {
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
        const { output, updatedFiles } = await trackPromise(
          workerApiRef.current!.runFile(filenames[0], files)
        );
        writeFile(updatedFiles);
        return output;
      });
    },
    [ready, writeFile, mutex, trackPromise]
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
