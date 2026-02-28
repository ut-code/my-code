import { cleanup, render, waitFor } from '@testing-library/react/pure';
import { describe, beforeAll, afterAll } from 'vitest';
import { RuntimeProvider, useRuntime } from '../src/context';
import { RuntimeLang } from '../src/languages';
import { RuntimeContext } from '../src/interface';
import { defineTests } from '../src/tests';
import { ReactNode, useEffect, useRef, useState } from 'react';

const testLangs: RuntimeLang[] = ['python', 'ruby', 'javascript', 'typescript', 'cpp', 'rust'];

import { usePyodide } from '../src/worker/pyodide';
import { useRuby } from '../src/worker/ruby';
import { useJSEval } from '../src/worker/jsEval';
import { useTypeScript } from '../src/typescript/runtime';
import { useWandbox } from '../src/wandbox/runtime';

const RuntimeLoader = ({ onReady }: { onReady: (runtimes: Record<RuntimeLang, RuntimeContext>) => void }) => {
  const pyodide = usePyodide();
  const ruby = useRuby();
  const jsEval = useJSEval();
  const typescript = useTypeScript(jsEval);
  const wandboxCpp = useWandbox("cpp");
  const wandboxRust = useWandbox("rust");

  const runtimes = useRef<Record<RuntimeLang, RuntimeContext>>({} as any);
  runtimes.current = {
    python: pyodide,
    ruby: ruby,
    javascript: jsEval,
    typescript: typescript,
    cpp: wandboxCpp,
    rust: wandboxRust,
  };

  useEffect(() => {
    pyodide.init?.();
    ruby.init?.();
    jsEval.init?.();
    typescript.init?.();
    wandboxCpp.init?.();
    wandboxRust.init?.();
  }, [pyodide, ruby, jsEval, typescript, wandboxCpp, wandboxRust]);

  useEffect(() => {
    if (
      pyodide.ready &&
      ruby.ready &&
      jsEval.ready &&
      typescript.ready &&
      wandboxCpp.ready &&
      wandboxRust.ready
    ) {
      onReady(runtimes.current);
    }
  }, [
    pyodide.ready,
    ruby.ready,
    jsEval.ready,
    typescript.ready,
    wandboxCpp.ready,
    wandboxRust.ready,
    onReady,
  ]);

  return null;
};

const AllProviders = ({ children }: { children: ReactNode }) => {
  return <RuntimeProvider>{children}</RuntimeProvider>;
};

describe('Runtime Integration Tests', () => {
  const runtimeRef = { current: {} as Record<RuntimeLang, RuntimeContext> };
  
  // Note: Vitest's describe blocks are executed during collection, 
  // but beforeEach/beforeAll and it blocks are executed during execution.
  // defineTests defines describe/it blocks, so it must be called during collection.
  // The runtimeRef.current will be populated by beforeAll before any tests (it blocks) run.

  beforeAll(async () => {
    let isDone = false;
    render(
      <AllProviders>
        <RuntimeLoader onReady={(runtimes) => {
          runtimeRef.current = runtimes;
          isDone = true;
        }} />
      </AllProviders>
    );
    await waitFor(() => {
      if (!isDone) throw new Error("Not ready");
    }, { timeout: 60000 });
  });
  afterAll(() => {
    cleanup();
  })

  for (const lang of testLangs) {
    defineTests(lang, runtimeRef);
  }
});
