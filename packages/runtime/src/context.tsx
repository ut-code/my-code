"use client";

import { ReactNode, useEffect } from "react";
import { RuntimeContext } from "./interface";
import { RuntimeLang } from "./languages";
import { TypeScriptProvider, useTypeScript } from "./typescript/runtime";
import { useWandbox, WandboxProvider } from "./wandbox/runtime";
import { JSEvalContext, useJSEval } from "./worker/jsEval";
import { PyodideContext, usePyodide } from "./worker/pyodide";
import { RubyContext, useRuby } from "./worker/ruby";
import { WorkerProvider } from "./worker/runtime";

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
