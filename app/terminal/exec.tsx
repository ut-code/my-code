"use client";

import {
  clearTerminal,
  getRows,
  hideCursor,
  systemMessageColor,
  useTerminal,
} from "./terminal";
import { writeOutput, ReplOutput } from "./repl";
import { useEffect, useState } from "react";
import { useEmbedContext } from "./embedContext";
import { RuntimeLang, useRuntime } from "./runtime";
import clsx from "clsx";

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
  const { terminalRef, terminalInstanceRef, termReady } = useTerminal({
    getRows: (cols: number) => getRows(props.content, cols) + 1,
    onReady: () => {
      hideCursor(terminalInstanceRef.current!);
      for (const line of props.content.split("\n")) {
        terminalInstanceRef.current!.writeln(line);
      }
    },
  });
  const { files, setExecResult } = useEmbedContext();

  const { ready, runFiles, getCommandlineStr } = useRuntime(props.language);

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
        const outputs: ReplOutput[] = [];
        let isFirstOutput = true;
        await runFiles(props.filenames, files, (output) => {
          outputs.push(output);
          if (isFirstOutput) {
            // Clear "実行中です..." message only on first output
            clearTerminal(terminalInstanceRef.current!);
            isFirstOutput = false;
          }
          // Append only the new output
          writeOutput(
            terminalInstanceRef.current!,
            [output],
            true,
            undefined,
            null, // ファイル実行で"return"メッセージが返ってくることはないはずなので、Prismを渡す必要はない
            props.language
          );
        });
        // TODO: 1つのファイル名しか受け付けないところに無理やりコンマ区切りで全部のファイル名を突っ込んでいる
        setExecResult(props.filenames.join(","), outputs);
        setExecutionState("idle");
      })();
    }
  }, [
    executionState,
    ready,
    props.filenames,
    runFiles,
    setExecResult,
    terminalInstanceRef,
    props.language,
    files,
  ]);

  return (
    <div className="border border-accent border-2 shadow-md m-2 rounded-box overflow-hidden relative">
      <div className="bg-base-200 flex items-center">
        <button
          /* daisyuiのbtnはheightがvar(--size)で固定。
          ここでは最小でそのサイズ、ただし親コンテナがそれより大きい場合に大きくしたい
          → heightを解除し、min-heightをデフォルトのサイズと同じにする */
          className="btn btn-soft btn-accent rounded-none h-[unset]! min-h-(--size) self-stretch"
          onClick={() => {
            if (!ready) {
              clearTerminal(terminalInstanceRef.current!);
              terminalInstanceRef.current!.write(
                systemMessageColor(
                  "(初期化しています...しばらくお待ちください)"
                )
              );
            }
            setExecutionState("triggered");
          }}
          disabled={!termReady || executionState !== "idle"}
        >
          ▶ 実行
        </button>
        <code className="text-left break-all text-sm my-1 ml-4 mr-1">
          {getCommandlineStr?.(props.filenames)}
        </code>
      </div>
      <div className="bg-base-300 p-4 pt-2 relative">
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
              "absolute invisible"
          )}
          ref={terminalRef}
        />
      </div>
      {executionState !== "idle" && (
        <div className="absolute z-10 inset-0 cursor-wait" />
      )}
    </div>
  );
}
