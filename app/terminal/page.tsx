"use client";
import { Heading } from "@/[docs_id]/markdown";
import "mocha/mocha.js";
import "mocha/mocha.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { useWandbox } from "./wandbox/runtime";
import { RuntimeContext, RuntimeLang } from "./runtime";
import { useEmbedContext } from "./embedContext";
import { defineTests } from "./tests";
import { usePyodide } from "./worker/pyodide";
import { useRuby } from "./worker/ruby";
import { useJSEval } from "./worker/jsEval";
import { ReplTerminal } from "./repl";
import { EditorComponent, getAceLang } from "./editor";
import { ExecFile } from "./exec";

export default function RuntimeTestPage() {
  return (
    <div className="p-4 mx-auto w-full max-w-200">
      <Heading level={1}>Runtime Test Page</Heading>

      <Heading level={2}>REPLとコード実行のサンプル</Heading>
      {/* name of each tab group should be unique */}
      <div className="tabs tabs-border">
        {Object.entries(sampleConfig).map(([lang, config]) => (
          <Fragment key={lang}>
            <input
              type="radio"
              name="runtime-sample-tabs"
              className="tab"
              aria-label={lang}
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <RuntimeSample lang={lang as RuntimeLang} config={config} />
            </div>
          </Fragment>
        ))}
      </div>

      <Heading level={2}>自動テスト</Heading>
      <MochaTest />
    </div>
  );
}

interface SampleConfig {
  repl: boolean;
  replInitContent?: string; // ReplOutput[] ではない。stringのパースはruntimeが行う
  editor: Record<string, string> | false;
  exec: string[] | false;
}
const sampleConfig: Record<RuntimeLang, SampleConfig> = {
  python: {
    repl: true,
    replInitContent: '>>> print("Hello, World!")\nHello, World!',
    editor: {
      "main.py": 'print("Hello, World!")',
    },
    exec: ["main.py"],
  },
  ruby: {
    repl: true,
    replInitContent: 'irb(main):001:0> puts "Hello, World!"\nHello, World!',
    editor: {
      "main.rb": 'puts "Hello, World!"',
    },
    exec: ["main.rb"],
  },
  javascript: {
    repl: true,
    replInitContent: '> console.log("Hello, World!");\nHello, World!',
    editor: false,
    exec: false,
  },
  cpp: {
    repl: false,
    editor: {
      "main.cpp": `#include <iostream>
#include "sub.h"

int main() {
    std::cout << "Hello, World!" << std::endl;
}`,
      "sub.h": ``,
      "sub.cpp": ``,
    },
    exec: ["main.cpp", "sub.cpp"],
  },
};
function RuntimeSample({
  lang,
  config,
}: {
  lang: RuntimeLang;
  config: SampleConfig;
}) {
  return (
    <div className="flex flex-col gap-4">
      {config.repl && (
        <ReplTerminal
          terminalId="1"
          language={lang}
          initContent={config.replInitContent}
        />
      )}
      {config.editor &&
        Object.entries(config.editor).map(([filename, initContent]) => (
          <EditorComponent
            key={filename}
            language={getAceLang(lang)}
            filename={filename}
            initContent={initContent}
          />
        ))}
      {config.exec && (
        <ExecFile filenames={config.exec} language={lang} content="" />
      )}
    </div>
  );
}

function MochaTest() {
  const pyodide = usePyodide();
  const ruby = useRuby();
  const javascript = useJSEval();
  const wandboxCpp = useWandbox("cpp");
  const runtimeRef = useRef<Record<RuntimeLang, RuntimeContext>>(null!);
  runtimeRef.current = {
    python: pyodide,
    ruby: ruby,
    javascript: javascript,
    cpp: wandboxCpp,
  };

  const [searchParams, setSearchParams] = useState<string>("");
  useEffect(() => {
    setSearchParams(window.location.search);
  }, []);
  const [mochaState, setMochaState] = useState<"idle" | "running" | "finished">(
    "idle"
  );
  const { writeFile } = useEmbedContext();

  const runTest = () => {
    setMochaState("running");

    mocha.setup("bdd");

    for (const lang of Object.keys(runtimeRef.current) as RuntimeLang[]) {
      defineTests(lang, runtimeRef, writeFile);
    }

    const runner = mocha.run();
    runner.on("end", () => {
      setMochaState("finished");
    });
  };

  return (
    <div className="border-1 border-transparent translate-x-0">
      {/* margin collapseさせない & fixedの対象をviewportではなくこのdivにする */}
      {mochaState === "idle" ? (
        <button className="btn btn-primary mt-4" onClick={runTest}>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info h-6 w-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
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
      <div className="m-0!" id="mocha" />
    </div>
  );
}
