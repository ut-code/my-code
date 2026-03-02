"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import { RuntimeContext } from "./interface";
import { RuntimeLang } from "./languages";
import { TypeScriptProvider, useTypeScript } from "./typescript/runtime";
import { useWandbox, WandboxProvider } from "./wandbox/runtime";
import { JSEvalContext, useJSEval } from "./worker/jsEval";
import { PyodideContext, usePyodide } from "./worker/pyodide";
import { RubyContext, useRuby } from "./worker/ruby";
import { WorkerProvider } from "./worker/runtime";

export function useRuntime(language: RuntimeLang): RuntimeContext {
  const runtimes = useRuntimeAll();
  const runtime = runtimes.current[language];
  const { init } = runtime;
  useEffect(() => {
    init?.();
  }, [init]);
  return runtime;
}
export function useRuntimeAll(): RefObject<Record<RuntimeLang, RuntimeContext>> {
  // すべての言語のcontextをインスタンス化
  const pyodide = usePyodide();
  const ruby = useRuby();
  const jsEval = useJSEval();
  const typescript = useTypeScript(jsEval);
  const wandboxCpp = useWandbox("cpp");
  const wandboxRust = useWandbox("rust");

  const runtimes = useRef<Record<RuntimeLang, RuntimeContext>>({} as never);
  runtimes.current.python = pyodide;
  runtimes.current.ruby = ruby;
  runtimes.current.javascript = jsEval;
  runtimes.current.typescript = typescript;
  runtimes.current.cpp = wandboxCpp;
  runtimes.current.rust = wandboxRust;

  // initはしない。呼び出し側でする必要がある
  return runtimes;
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
