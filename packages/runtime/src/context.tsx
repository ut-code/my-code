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

interface UseRuntimeOptions {
  onError?: (error: unknown) => void;
}
export function useRuntime(
  language: RuntimeLang,
  options?: UseRuntimeOptions
): RuntimeContext {
  const runtimes = useRuntimeAll();
  const runtime = runtimes[language];
  const { init } = runtime;
  const { onError } = options ?? {};
  useEffect(() => {
    init?.(onError);
  }, [init, onError]);
  return runtime;
}
export function useRuntimeAll(): Record<RuntimeLang, RuntimeContext> {
  // すべての言語のcontextをインスタンス化
  const pyodide = usePyodide();
  const ruby = useRuby();
  const jsEval = useJSEval();
  const typescript = useTypeScript(jsEval);
  const wandboxCpp = useWandbox("cpp");
  const wandboxRust = useWandbox("rust");

  // initはしない。呼び出し側でする必要がある
  return {
    python: pyodide,
    ruby: ruby,
    javascript: jsEval,
    typescript: typescript,
    cpp: wandboxCpp,
    rust: wandboxRust,
  };
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
