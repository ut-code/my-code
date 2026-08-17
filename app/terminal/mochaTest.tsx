"use client";

import "mocha/mocha.css";
import { useEffect, useRef, useState } from "react";
import { RuntimeLang } from "@my-code/runtime/languages";
import {
  RUNTIME_TIMEOUTS,
  waitForRuntimeReady,
} from "@my-code/runtime/tests/utils";
import { replTests } from "@my-code/runtime/tests/repl";
import { fileExecutionTests } from "@my-code/runtime/tests/fileExecution";
import { useRuntimeAll } from "@my-code/runtime/context";
import { DaisyInfoIcon } from "@/daisyAlertIcon";
import { captureException } from "@sentry/nextjs";
import { usePathname } from "next/navigation";

function handleRuntimeError(error: unknown) {
  captureException(error);
}

export function MochaTest() {
  const pathname = usePathname();
  const runtimeAll = useRuntimeAll();
  const runtimeRef = useRef(runtimeAll);
  for (const lang of Object.keys(runtimeAll) as RuntimeLang[]) {
    runtimeRef.current[lang] = runtimeAll[lang];
  }

  const [searchParams, setSearchParams] = useState<string>("");
  useEffect(() => {
    setSearchParams(window.location.search);
  }, []);
  const [mochaState, setMochaState] = useState<"idle" | "running" | "finished">(
    "idle"
  );
  const runTest = async () => {
    if (typeof window !== "undefined") {
      setMochaState("running");

      await import("mocha/mocha.js");

      mocha.setup("bdd");

      for (const lang of Object.keys(runtimeRef.current) as RuntimeLang[]) {
        runtimeRef.current[lang].init?.(handleRuntimeError);

        describe(`${lang} Runtime`, function () {
          this.timeout(RUNTIME_TIMEOUTS[lang]);

          beforeEach(async function () {
            this.timeout(60000);
            await waitForRuntimeReady(lang, runtimeRef);
          });

          describe("REPL", function () {
            for (const [name, generator] of Object.entries(replTests)) {
              const body = generator(lang);
              if (body) {
                it(name, async () => body(runtimeRef));
              } else {
                it.skip(name);
              }
            }
          });

          describe("File Execution", function () {
            for (const [name, generator] of Object.entries(
              fileExecutionTests
            )) {
              const body = generator(lang);
              if (body) {
                it(name, async () => body(runtimeRef));
              } else {
                it.skip(name);
              }
            }
          });
        });
      }

      const runner = mocha.run();
      runner.on("fail", (test, err: unknown) => {
        console.error(err, {
          extra: {
            fullTitle: test.fullTitle(),
            ...(typeof err === "object" && err ? err : {}),
          },
        });
      });
      runner.on("end", () => {
        setMochaState("finished");
      });
    }
  };

  return (
    <div className="border-1 border-transparent translate-x-0">
      {/* margin collapseさせない & fixedの対象をviewportではなくこのdivにする */}
      {mochaState === "idle" ? (
        <button className="btn btn-accent mt-4" onClick={runTest}>
          テストを実行
        </button>
      ) : mochaState === "running" ? (
        <div className="alert mt-16 sm:mt-4 w-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin h-5 w-5 mr-3 border-2 border-solid border-current border-t-transparent rounded-full"
            fill="none"
            viewBox="0 0 24 24"
          ></svg>
          テストを実行中です...
        </div>
      ) : (
        <div className="alert mt-16 sm:mt-4 w-80">
          <DaisyInfoIcon className="text-info" />
          テストが完了しました
        </div>
      )}
      <p className="mt-8">
        {new URLSearchParams(searchParams).has("grep") && (
          <>
            一部のテストだけを実行します:
            <code className="ml-2 font-mono">
              {new URLSearchParams(searchParams).get("grep")}
            </code>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="ml-4 link link-info" href={pathname}>
              {/* クエリパラメータの削除。 aタグでページをリロードしないと動作しない。 */}
              フィルタを解除
            </a>
          </>
        )}
      </p>
      <div className="m-0! font-sans!" id="mocha" />
    </div>
  );
}
