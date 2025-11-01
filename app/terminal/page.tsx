"use client";
import { Heading } from "@/[docs_id]/markdown";
import "mocha/mocha.js";
import "mocha/mocha.css";
import { useEffect, useRef, useState } from "react";
import { useWandbox } from "./wandbox/runtime";
import { RuntimeContext, RuntimeLang } from "./runtime";
import { useEmbedContext } from "./embedContext";
import { defineTests } from "./tests";
import { usePyodide } from "./worker/pyodide";
import { useRuby } from "./worker/ruby";
import { useJSEval } from "./worker/jsEval";

export default function RuntimeTestPage() {
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
  const { files, writeFile } = useEmbedContext();
  const filesRef = useRef<Record<string, string>>({});
  filesRef.current = files;
  const [mochaState, setMochaState] = useState<"idle" | "running" | "finished">(
    "idle"
  );
  const [searchParams, setSearchParams] = useState<string>("");
  useEffect(() => {
    setSearchParams(window.location.search);
  }, []);

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
    <div className="p-4 mx-auto w-full max-w-200">
      <Heading level={1}>Runtime Test Page</Heading>
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
    </div>
  );
}
