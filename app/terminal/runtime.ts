import { MutexInterface } from "async-mutex";
import { ReplOutput, SyntaxStatus, ReplCommand } from "./repl";
import { usePyodide } from "./python/pyodide";
import { useWandbox } from "./wandbox/wandbox";

/**
 * Common runtime context interface for different languages
 *
 * see README.md for details
 *
 */
export interface RuntimeContext {
  ready: boolean;
  tabSize: number;
  mutex?: MutexInterface;
  interrupt?: () => void;
  // repl
  runCommand?: (command: string) => Promise<ReplOutput[]>;
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
  splitReplExamples?: (content: string) => ReplCommand[];
  prompt?: string;
  promptMore?: string;
  // file
  runFiles: (filenames: string[]) => Promise<ReplOutput[]>;
  getCommandlineStr: (filenames: string[]) => string;
}

export type RuntimeLang = "python" | "cpp";

export function useRuntime(language: RuntimeLang): RuntimeContext {
  const pyodide = usePyodide();
  const wandbox = useWandbox("C++");

  switch (language) {
    case "python":
      return pyodide;
    case "cpp":
      return wandbox;
    default:
      language satisfies never;
      throw new Error(`Runtime not implemented for language: ${language}`);
  }
}

export const emptyMutex: MutexInterface = {
  runExclusive: async <T>(fn: () => Promise<T> | T) => {
    const result = fn();
    return result instanceof Promise ? result : Promise.resolve(result);
  },
  acquire: async () => {
    return () => {}; // Release function (no-op)
  },
  waitForUnlock: async () => {},
  isLocked: () => false,
  cancel: () => {},
  release: () => {},
};
