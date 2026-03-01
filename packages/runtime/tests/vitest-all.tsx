import { cleanup, render } from "@testing-library/react/pure";
import { describe, beforeAll, afterAll, it, beforeEach } from "vitest";
import { RuntimeProvider } from "../src/context";
import { RuntimeLang } from "../src/languages";
import { RuntimeContext } from "../src/interface";
import { RefObject, useEffect, useRef } from "react";

import { usePyodide } from "../src/worker/pyodide";
import { useRuby } from "../src/worker/ruby";
import { useJSEval } from "../src/worker/jsEval";
import { useTypeScript } from "../src/typescript/runtime";
import { useWandbox } from "../src/wandbox/runtime";
import { RUNTIME_TIMEOUTS, waitForRuntimeReady } from "./utils";
import { replTests } from "./repl";
import { fileExecutionTests } from "./fileExecution";

const RuntimeLoader = ({
  runtimeRef,
}: {
  runtimeRef: RefObject<Record<RuntimeLang, RuntimeContext> | null>;
}) => {
  const pyodide = usePyodide();
  const ruby = useRuby();
  const jsEval = useJSEval();
  const typescript = useTypeScript(jsEval);
  const wandboxCpp = useWandbox("cpp");
  const wandboxRust = useWandbox("rust");

  runtimeRef.current = {
    python: pyodide,
    ruby: ruby,
    javascript: jsEval,
    typescript: typescript,
    cpp: wandboxCpp,
    rust: wandboxRust,
  };

  return null;
};

describe("Runtime Integration Tests", () => {
  const runtimeRef: RefObject<Record<RuntimeLang, RuntimeContext> | null> = {
    current: null,
  };

  // beforeAll/afterAll にすると、runtimeの初期化が全体で1回
  // beforeEach/afterEach にすると、test1つごとに再初期化する。(遅い)
  // どちらでもテストは動くが、
  // 実際のアプリではruntimeの初期化はページ読み込み時の1回のみで、
  // ページ移動等で再初期化されることは絶対にないので、
  // 普段beforeEachでテストする意味はない
  // デバッグ時にはeachに変えてvitestを動かすのもあり
  beforeAll(async () => {
    runtimeRef.current = null;
    render(
      <RuntimeProvider>
        <RuntimeLoader runtimeRef={runtimeRef} />
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
                await body(
                  runtimeRef as RefObject<Record<RuntimeLang, RuntimeContext>>
                );
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
                await body(runtimeRef as RefObject<Record<RuntimeLang, RuntimeContext>>);
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
