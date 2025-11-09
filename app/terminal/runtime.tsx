import { MutexInterface } from "async-mutex";
import { ReplOutput, SyntaxStatus, ReplCommand } from "./repl";
import { useWandbox, WandboxProvider } from "./wandbox/runtime";
import { AceLang } from "./editor";
import { ReactNode } from "react";
import { PyodideContext, usePyodide } from "./worker/pyodide";
import { RubyContext, useRuby } from "./worker/ruby";
import { JSEvalContext, useJSEval } from "./worker/jsEval";
import { WorkerProvider } from "./worker/runtime";
import { TypeScriptProvider, useTypeScript } from "./typescript/runtime";

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
  runFiles: (filenames: string[], files: Record<string, string>) => Promise<ReplOutput[]>;
  getCommandlineStr?: (filenames: string[]) => string;
}
export interface LangConstants {
  tabSize: number;
  prompt?: string;
  promptMore?: string;
  returnPrefix?: string;
}
export type RuntimeLang =
  | "python"
  | "ruby"
  | "cpp"
  | "javascript"
  | "typescript";

export function getRuntimeLang(
  lang: string | undefined
): RuntimeLang | undefined {
  // markdownで指定される可能性のある言語名からRuntimeLangを取得
  switch (lang) {
    case "python":
    case "py":
      return "python";
    case "ruby":
    case "rb":
      return "ruby";
    case "cpp":
    case "c++":
      return "cpp";
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    default:
      console.warn(`Unsupported language for runtime: ${lang}`);
      return undefined;
  }
}
export function useRuntime(language: RuntimeLang): RuntimeContext {
  // すべての言語のcontextをインスタンス化
  const pyodide = usePyodide();
  const ruby = useRuby();
  const jsEval = useJSEval();
  const typescript = useTypeScript(jsEval);
  const wandboxCpp = useWandbox("cpp");

  switch (language) {
    case "python":
      return pyodide;
    case "ruby":
      return ruby;
    case "javascript":
      return jsEval;
    case "typescript":
      return typescript;
    case "cpp":
      return wandboxCpp;
    default:
      language satisfies never;
      throw new Error(`Runtime not implemented for language: ${language}`);
  }
}
export function RuntimeProvider({ children }: { children: ReactNode }) {
  return (
    <WorkerProvider context={PyodideContext} script="/pyodide.worker.js">
      <WorkerProvider context={RubyContext} script="/ruby.worker.js">
        <WorkerProvider context={JSEvalContext} script="/javascript.worker.js">
          <WandboxProvider>
            <TypeScriptProvider>{children}</TypeScriptProvider>
          </WandboxProvider>
        </WorkerProvider>
      </WorkerProvider>
    </WorkerProvider>
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
    case "ruby":
      return {
        tabSize: 2,
        // TODO: 実際のirbのプロンプトは静的でなく、(main)や番号などの動的な表示がある
        prompt: "irb> ",
        promptMore: "irb* ",
        returnPrefix: "=> ",
      };
    case "javascript":
      return {
        tabSize: 2,
        prompt: "> ",
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
