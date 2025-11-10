"use client";

import {
  clearTerminal,
  getRows,
  hideCursor,
  systemMessageColor,
  useTerminal,
} from "./terminal";
import { writeOutput } from "./repl";
import { useEffect, useState } from "react";
import { useEmbedContext } from "./embedContext";
import { RuntimeLang, useRuntime } from "./runtime";

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
        const outputs = await runFiles(props.filenames, files);
        clearTerminal(terminalInstanceRef.current!);
        writeOutput(
          terminalInstanceRef.current!,
          outputs,
          false,
          undefined,
          null, // ファイル実行で"return"メッセージが返ってくることはないはずなので、Prismを渡す必要はない
          props.language
        );
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
    <div className="relative">
      <div>
        <button
          className="btn btn-soft btn-primary rounded-tl-lg rounded-none"
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
        <code className="text-sm ml-4">
          {getCommandlineStr?.(props.filenames)}
        </code>
      </div>
      <div className="bg-base-300 p-4 pt-2 rounded-b-lg">
        <div ref={terminalRef} />
      </div>
      {executionState !== "idle" && (
        <div className="absolute z-10 inset-0 cursor-wait" />
      )}
    </div>
  );
}
