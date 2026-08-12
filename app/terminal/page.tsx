"use client";

import { Heading } from "@/markdown/heading";
import "mocha/mocha.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { langConstants, RuntimeLang } from "@my-code/runtime/languages";
import { ReplTerminal } from "./repl";
import { EditorComponent } from "./editor";
import { ExecFile } from "./exec";
import { useTerminal } from "./terminal";
import {
  RUNTIME_TIMEOUTS,
  waitForRuntimeReady,
} from "@my-code/runtime/tests/utils";
import { replTests } from "@my-code/runtime/tests/repl";
import { fileExecutionTests } from "@my-code/runtime/tests/fileExecution";
import { useRuntimeAll } from "@my-code/runtime/context";
import { captureException } from "@sentry/nextjs";

import { sampleConfig, SampleConfig } from "./sampleConfig";
import { DaisyInfoIcon } from "@/daisyAlertIcon";

export default function RuntimeTestPage() {
  return (
    <div className="p-4 mx-auto w-full max-w-docs">
      <Heading level={1}>Runtime Test Page</Heading>

      <Heading level={2}>REPLとコード実行のサンプル</Heading>
      {/* name of each tab group should be unique */}
      <div className="tabs tabs-box">
        {Object.entries(sampleConfig).map(([lang, config]) => (
          <Fragment key={lang}>
            <input
              type="radio"
              name="runtime-sample-tabs"
              className="tab"
              aria-label={lang}
            />
            <div className="tab-content border-base-300 bg-base-100">
              <RuntimeSample lang={lang as RuntimeLang} config={config} />
            </div>
          </Fragment>
        ))}
      </div>

      <Heading level={2}>Xterm.js Colors</Heading>
      <AnsiColorSample />

      <button
        className="btn mt-4"
        onClick={() => {
          throw new Error("Sentry Test Error");
        }}
      >
        Sentry Test Error
      </button>

      <Heading level={2}>自動テスト</Heading>
      <MochaTest />
    </div>
  );
}

function RuntimeSample({
  lang,
  config,
}: {
  lang: RuntimeLang;
  config: SampleConfig;
}) {
  return (
    <div className="flex flex-col">
      {config.repl && (
        <ReplTerminal
          terminalId="1"
          language={langConstants(lang)}
          initContent={config.replInitContent}
        />
      )}
      {config.editor &&
        Object.entries(config.editor).map(([filename, initContent]) => (
          <EditorComponent
            key={filename}
            language={langConstants(lang)}
            filename={filename}
            initContent={initContent}
          />
        ))}
      {config.exec && (
        <ExecFile
          filenames={config.exec}
          language={langConstants(lang)}
          content=""
        />
      )}
      {config.readonlyFiles?.map((filename) => (
        <EditorComponent
          key={filename}
          language={langConstants(lang)}
          filename={filename}
          initContent=""
          readonly
        />
      ))}
    </div>
  );
}

function AnsiColorSample() {
  const { terminalRef, terminalInstanceRef } = useTerminal({
    getRows: () => 6,
    onReady: () => {
      for (let i = 0; i <= 7; i++) {
        terminalInstanceRef.current!.write(`\x1b[0;${30 + i}m${30 + i}`);
      }
      terminalInstanceRef.current!.write("\x1b[0m\n");
      terminalInstanceRef.current!.write("\x1b[1m1;");
      for (let i = 0; i <= 7; i++) {
        terminalInstanceRef.current!.write(`\x1b[1;${30 + i}m${30 + i}`);
      }
      terminalInstanceRef.current!.write("\x1b[0m\n");
      for (let i = 0; i <= 7; i++) {
        terminalInstanceRef.current!.write(`\x1b[0;${90 + i}m${90 + i}`);
      }
      terminalInstanceRef.current!.write("\x1b[0m\n");
      terminalInstanceRef.current!.write("\x1b[1m1;");
      for (let i = 0; i <= 7; i++) {
        terminalInstanceRef.current!.write(`\x1b[1;${90 + i}m${90 + i}`);
      }
      terminalInstanceRef.current!.write("\x1b[0m\n");
      for (let i = 0; i <= 7; i++) {
        terminalInstanceRef.current!.write(`\x1b[0;${40 + i}m${40 + i}`);
      }
      terminalInstanceRef.current!.write("\x1b[0m\n");
      for (let i = 0; i <= 7; i++) {
        terminalInstanceRef.current!.write(`\x1b[0;${100 + i}m${100 + i}`);
      }
    },
  });
  return (
    <div className="bg-base-300 border border-accent border-2 shadow-md m-2 p-4 pr-1 rounded-box relative h-max">
      <div ref={terminalRef} />
    </div>
  );
}

function handleRuntimeError(error: unknown) {
  captureException(error);
}

function MochaTest() {
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
            <a className="ml-4 link link-info" href="/terminal">
              {/* aタグでページをリロードしないと動作しない。 */}
              フィルタを解除
            </a>
          </>
        )}
      </p>
      <div className="m-0! font-sans!" id="mocha" />
    </div>
  );
}
