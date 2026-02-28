import { cleanup, render } from "@testing-library/react/pure";
import { describe, beforeAll, afterAll, it, beforeEach } from "vitest";
import { RuntimeProvider } from "../src/context";
import { RuntimeLang } from "../src/languages";
import { RuntimeContext } from "../src/interface";
import { useEffect, useRef } from "react";

import { usePyodide } from "../src/worker/pyodide";
import { useRuby } from "../src/worker/ruby";
import { useJSEval } from "../src/worker/jsEval";
import { useTypeScript } from "../src/typescript/runtime";
import { useWandbox } from "../src/wandbox/runtime";
import { RUNTIME_TIMEOUTS, waitForRuntimeReady } from "./utils";
import { replTests } from "./repl";
import { fileExecutionTests } from "./fileExecution";

const RuntimeLoader = ({
  onReady,
}: {
  onReady: (runtimes: Record<RuntimeLang, RuntimeContext>) => void;
}) => {
  const pyodide = usePyodide();
  const ruby = useRuby();
  const jsEval = useJSEval();
  const typescript = useTypeScript(jsEval);
  const wandboxCpp = useWandbox("cpp");
  const wandboxRust = useWandbox("rust");

  const runtimes = useRef<Record<RuntimeLang, RuntimeContext>>(null!);
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

describe("Runtime Integration Tests", () => {
  const runtimeRef = { current: {} as Record<RuntimeLang, RuntimeContext> };

  // Note: Vitest's describe blocks are executed during collection,
  // but beforeEach/beforeAll and it blocks are executed during execution.
  // describe/it blocks must be called during collection.
  // The runtimeRef.current will be populated by beforeAll before any tests (it blocks) run.

  beforeAll(async () => {
    render(
      <RuntimeProvider>
        <RuntimeLoader
          onReady={(runtimes) => {
            runtimeRef.current = runtimes;
          }}
        />
      </RuntimeProvider>
    );
  });
  afterAll(() => {
    cleanup();
  });

  for (const lang of Object.keys(RUNTIME_TIMEOUTS) as RuntimeLang[]) {
    describe(`${lang} Runtime`, () => {
      beforeEach(async () => {
        await waitForRuntimeReady(lang, runtimeRef);
      }, 60000);

      describe("REPL", () => {
        for (const [name, generator] of Object.entries(replTests)) {
          const body = generator(lang);
          if (body) {
            it(
              name,
              async () => {
                await body(runtimeRef);
              },
              RUNTIME_TIMEOUTS[lang]
            );
          } else {
            it.skip(name, () => {});
          }
        }
      });

      describe("File Execution", () => {
        for (const [name, generator] of Object.entries(fileExecutionTests)) {
          const body = generator(lang);
          if (body) {
            it(
              name,
              async () => {
                await body(runtimeRef);
              },
              RUNTIME_TIMEOUTS[lang]
            );
          } else {
            it.skip(name, () => {});
          }
        }
      });
    });
  }
});
