"use client";

import { MutexInterface } from "async-mutex";
import { ReplOutput, SyntaxStatus, ReplCommand } from "./repl";
import { useWandbox, WandboxProvider } from "./wandbox/runtime";
import { AceLang } from "./editor";
import { ReactNode, useEffect } from "react";
import { PyodideContext, usePyodide } from "./worker/pyodide";
import { RubyContext, useRuby } from "./worker/ruby";
import { JSEvalContext, useJSEval } from "./worker/jsEval";
import { WorkerProvider } from "./worker/runtime";
import { TypeScriptProvider, useTypeScript } from "./typescript/runtime";
import { MarkdownLang } from "@/[docs_id]/styledSyntaxHighlighter";

/**
 * Common runtime context interface for different languages
 *
 * see README.md for details
 *
 */
export interface RuntimeContext {
  init?: () => void;
  ready: boolean;
  mutex?: MutexInterface;
  interrupt?: () => void;
  // repl
  runCommand?: (command: string) => Promise<ReplOutput[]>;
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
  splitReplExamples?: (content: string) => ReplCommand[];
  // file
  runFiles: (
    filenames: string[],
    files: Readonly<Record<string, string>>
  ) => Promise<ReplOutput[]>;
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
  | "rust"
  | "javascript"
  | "typescript";

export function getRuntimeLang(
  lang: MarkdownLang | undefined
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
    case "rust":
    case "rs":
      return "rust";
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    case "bash":
    case "sh":
    case "json":
    case "csv":
    case "text":
    case "txt":
    case "html":
    case "makefile":
    case "cmake":
    case undefined:
      // unsupported languages
      return undefined;
    default:
      lang satisfies never;
      console.error(`getRuntimeLang() does not handle language ${lang}`);
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
  const wandboxRust = useWandbox("rust");

  let runtime: RuntimeContext;
  switch (language) {
    case "python":
      runtime = pyodide;
      break;
    case "ruby":
      runtime = ruby;
      break;
    case "javascript":
      runtime = jsEval;
      break;
    case "typescript":
      runtime = typescript;
      break;
    case "cpp":
      runtime = wandboxCpp;
      break;
    case "rust":
      runtime = wandboxRust;
      break;
    default:
      language satisfies never;
      throw new Error(`Runtime not implemented for language: ${language}`);
  }
  const { init } = runtime;
  useEffect(() => {
    init?.();
  }, [init]);
  return runtime;
}
export function RuntimeProvider({ children }: { children: ReactNode }) {
  return (
    <WorkerProvider context={PyodideContext} lang="python">
      <WorkerProvider context={RubyContext} lang="ruby">
        <WorkerProvider context={JSEvalContext} lang="javascript">
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
    case "typescript":
      return {
        tabSize: 2,
        prompt: "> ",
        promptMore: "... ",
      };
    case "c_cpp":
    case "cpp":
      return {
        // 2文字派と4文字派があるが、geminiが4文字で出力するので4でいいや
        tabSize: 4,
      };
    case "rust":
      return {
        tabSize: 4,
      };
    case "json":
      return {
        // python-7章で使っている
        tabSize: 4,
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
