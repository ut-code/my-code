"use client";

import {
  calculateRows,
  clearTerminal,
  hideCursor,
  systemMessageColor,
  useTerminal,
} from "./terminal";
import { writeOutput } from "./repl";
import { useCallback, useEffect, useState } from "react";
import { useEmbedContext } from "./embedContext";
import { RuntimeLang, useRuntime } from "./runtime";
import clsx from "clsx";
import { MinMaxButton, Modal } from "./modal";

interface ExecProps {
  /*
   * Pythonの場合はメインファイル1つのみを指定する。
   * C++の場合はソースコード(.cpp)を全部指定する。
   */
  filenames: string[];
  language: RuntimeLang;
  content: string;
}
export function ExecFile(props: ExecProps) {
  // ターミナルの行数を計算するためのstate
  const [contents, setContents] = useState(props.content + "\n");
  const [isModal, setIsModal] = useState(false);
  const [fontSize, setFontSize] = useState<number>();
  const [windowHeight, setWindowHeight] = useState<number>(1000);
  useEffect(() => {
    const update = () => {
      setFontSize(
        parseFloat(getComputedStyle(document.documentElement).fontSize)
      ); // 1rem
      setWindowHeight(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const getRows = useCallback(
    (cols: number) =>
      isModal
        ? "fit"
        : Math.min(
            calculateRows(contents, cols),
            Math.floor((windowHeight * 0.2) / ((fontSize || 16) * 1.2))
          ),
    [contents, isModal, fontSize, windowHeight]
  );
  const { terminalRef, terminalInstanceRef, termReady } = useTerminal({
    getRows,
    onReady: () => {
      hideCursor(terminalInstanceRef.current!);
      for (const line of props.content.split("\n")) {
        terminalInstanceRef.current!.writeln(line);
      }
    },
  });
  const { files, clearExecResult, addExecOutput, writeFile } =
    useEmbedContext();

  const { ready, runFiles, getCommandlineStr, runtimeInfo, interrupt } =
    useRuntime(props.language);

  // ユーザーがクリックした時(triggered) && ランタイムが準備できた時に、実際にinitCommandを実行する(executing)
  const [executionState, setExecutionState] = useState<
    "idle" | "triggered" | "executing"
  >("idle");
  useEffect(() => {
    if (executionState === "triggered" && ready) {
      setExecutionState("executing");
      (async () => {
        clearTerminal(terminalInstanceRef.current!);
        terminalInstanceRef.current!.write(systemMessageColor("実行中です..."));
        // TODO: 1つのファイル名しか受け付けないところに無理やりコンマ区切りで全部のファイル名を突っ込んでいる
        const filenameKey = props.filenames.join(",");
        clearExecResult(filenameKey);
        setContents("");
        let isFirstOutput = true;
        await runFiles(props.filenames, files, (output) => {
          if (output.type === "file") {
            writeFile({ [output.filename]: output.content });
            return;
          }
          addExecOutput(filenameKey, output);
          if (isFirstOutput) {
            // Clear "実行中です..." message only on first output
            clearTerminal(terminalInstanceRef.current!);
            isFirstOutput = false;
          }
          // Append only the new output
          writeOutput(
            terminalInstanceRef.current!,
            output,
            undefined,
            null, // ファイル実行で"return"メッセージが返ってくることはないはずなので、Prismを渡す必要はない
            props.language
          );
          setContents((prev) => prev + output.message + "\n");
        });
        setExecutionState("idle");
      })();
    }
  }, [
    executionState,
    ready,
    props.filenames,
    runFiles,
    clearExecResult,
    addExecOutput,
    writeFile,
    terminalInstanceRef,
    props.language,
    files,
  ]);

  return (
    <Modal
      className={clsx(
        "border border-accent border-2 rounded-box relative",
        "flex flex-col"
      )}
      classNameNonModal="shadow-md m-2"
      open={isModal}
      onClose={() => setIsModal(false)}
    >
      <div className="bg-base-200 flex items-center rounded-t-box">
        <button
          /* daisyuiのbtnはheightがvar(--size)で固定。
          ここでは最小でそのサイズ、ただし親コンテナがそれより大きい場合に大きくしたい
          → heightを解除し、min-heightをデフォルトのサイズと同じにする */
          className={clsx(
            "btn btn-soft h-[unset]! min-h-(--size) self-stretch",
            executionState === "idle" ? "btn-accent" : "btn-error",
            "rounded-none rounded-tl-[calc(var(--radius-box)-2px)]"
          )}
          onClick={() => {
            if (!ready) {
              clearTerminal(terminalInstanceRef.current!);
              terminalInstanceRef.current!.write(
                systemMessageColor(
                  "(初期化しています...しばらくお待ちください)"
                )
              );
            }
            if (executionState === "idle") {
              setExecutionState("triggered");
            }
            if (executionState === "executing" && interrupt) {
              // Ctrl+C
              interrupt();
              terminalInstanceRef.current!.write("^C");
            }
          }}
          disabled={
            !termReady ||
            !(
              executionState === "idle" ||
              (executionState === "executing" && interrupt)
            )
          }
        >
          {executionState === "idle" ? (
            <StartButtonContent />
          ) : (
            <StopButtonContent />
          )}
        </button>
        <code className="text-left break-all text-sm my-1 ml-4">
          {getCommandlineStr?.(props.filenames)}
        </code>
        <div className="ml-1 mr-1 tooltip tooltip-secondary tooltip-bottom z-1">
          {/*なぜかわからないがz-1がないと後ろに隠れてしまう*/}
          <div className="tooltip-content bg-secondary/60 backdrop-blur-xs">
            ブラウザ上で動作する
            <span className="mx-0.5">
              {runtimeInfo?.prettyLangName || props.language}
            </span>
            {runtimeInfo?.version && (
              <span className="mr-0.5">{runtimeInfo?.version}</span>
            )}
            の実行環境です。
            <br />
            左上の実行ボタンを押して、このページ内の
            {props.filenames.map((fname) => (
              <span key={fname}>
                <span className="font-mono mx-0.5">{fname}</span>
              </span>
            ))}
            に書かれている内容を実行します。
          </div>
          <button
            className={clsx(
              "btn btn-xs btn-soft btn-secondary rounded-full cursor-help"
            )}
          >
            ？
          </button>
        </div>
        <div className="flex-1" />
        <MinMaxButton open={isModal} setOpen={setIsModal} />
      </div>
      <div className="flex-1 bg-base-300 p-4 pr-1 pt-2 relative rounded-b-box">
        {/*
      ターミナル表示の初期化が完了するまでの間、ターミナルは隠し、内容をそのまま表示する。
      可能な限りレイアウトが崩れないようにするため & SSRでも内容が読めるように(SEO?)という意味もある
      */}
        <pre
          className={clsx(
            "font-mono overflow-auto cursor-wait",
            "min-h-26", // xterm.jsで5行分の高さ
            termReady && "hidden"
          )}
        >
          {props.content}
        </pre>
        <div
          className={clsx(
            !termReady &&
              /* "hidden" だとterminalがdivのサイズを取得しようとしたときにバグる*/
              "absolute invisible",
            "h-full"
          )}
          ref={terminalRef}
        />
        {executionState !== "idle" && (
          <div className="absolute z-10 inset-0 cursor-wait" />
        )}
      </div>
    </Modal>
  );
}

export function StartButtonContent() {
  return "▶ 実行";
}
export function StopButtonContent() {
  /*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/
  return (
    <>
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 12C6 12.5523 6.44772 13 7 13L17 13C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H7C6.44772 11 6 11.4477 6 12Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z"
          fill="currentColor"
        />
      </svg>
      停止
    </>
  );
}
