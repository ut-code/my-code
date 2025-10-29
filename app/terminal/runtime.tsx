import { MutexInterface } from "async-mutex";
import { ReplOutput, SyntaxStatus, ReplCommand } from "./repl";
import { PyodideProvider, usePyodide } from "./python/runtime";
import { useWandbox, WandboxProvider } from "./wandbox/runtime";
import { AceLang } from "./editor";
import { ReactNode } from "react";

/**
 * Common runtime context interface for different languages
 *
 * see README.md for details
 *
 */
export interface RuntimeContext {
  ready: boolean;
  mutex?: MutexInterface;
  interrupt?: () => void;
  // repl
  runCommand?: (command: string) => Promise<ReplOutput[]>;
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
  splitReplExamples?: (content: string) => ReplCommand[];
  // file
  runFiles: (filenames: string[]) => Promise<ReplOutput[]>;
  getCommandlineStr: (filenames: string[]) => string;
}
export interface LangConstants {
  tabSize: number;
  prompt?: string;
  promptMore?: string;
}
export type RuntimeLang = "python" | "cpp";

export function useRuntime(language: RuntimeLang): RuntimeContext {
  const pyodide = usePyodide();
  const wandboxCpp = useWandbox("cpp");

  switch (language) {
    case "python":
      return pyodide;
    case "cpp":
      return wandboxCpp;
    default:
      language satisfies never;
      throw new Error(`Runtime not implemented for language: ${language}`);
  }
}
export function RuntimeProvider({ children }: { children: ReactNode }) {
  return (
    <PyodideProvider>
      <WandboxProvider>{children}</WandboxProvider>
    </PyodideProvider>
  );
}

export function langConstants(lang: RuntimeLang | AceLang): LangConstants {
  switch (lang) {
    case "python":
      return {
        tabSize: 4,
        prompt: ">>> ",
        promptMore: "... ",
      };
    case "c_cpp":
    case "cpp":
      return {
        tabSize: 2,
      };
    case "json":
      return {
        tabSize: 2,
      };
    case "csv":
    case "text":
      return {
        // tabは使わないが、0は指定できないようなので適当にデフォルト値
        tabSize: 4,
      };
    default:
      lang satisfies never;
      throw new Error(`LangConstants not defined for language: ${lang}`);
  }
}

export const emptyMutex: MutexInterface = {
  async runExclusive<T>(fn: () => Promise<T> | T) {
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
