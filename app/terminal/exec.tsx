"use client";

import {
  clearTerminal,
  getRows,
  hideCursor,
  systemMessageColor,
  useTerminal,
} from "./terminal";
import { writeOutput } from "./repl";
import { useState } from "react";
import { useEmbedContext } from "./embedContext";
import { useRuntime } from "./runtime";

export type ExecLang = "python" | "cpp";

interface ExecProps {
  /*
   * Pythonの場合はメインファイル1つのみを指定する。
   * C++の場合はソースコード(.cpp)を全部指定する。
   */
  filenames: string[];
  language: ExecLang;
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
  const sectionContext = useEmbedContext();

  const runtime = useRuntime(props.language);

  // 表示するコマンドライン文字列
  let commandline: string;
  if (props.language === "python") {
    if (props.filenames.length !== 1) {
      throw new Error("Pythonの実行にはファイル名が1つ必要です");
    }
    commandline = `python ${props.filenames[0]}`;
  } else if (props.language === "cpp") {
    if (!props.filenames || props.filenames.length === 0) {
      throw new Error("C++の実行には filenames プロパティが必要です");
    }
    commandline = runtime.getCommandlineStr
      ? runtime.getCommandlineStr(props.filenames)
      : `g++ ${props.filenames.join(" ")}`;
  } else {
    props.language satisfies never;
    commandline = `エラー: 非対応の言語 ${props.language}`;
  }

  const runtimeInitializing = runtime.initializing;
  const beforeExec = runtime.ready ? null : runtime.init;
  const exec = () => runtime.runFiles(props.filenames);

  // 実行中です... と表示される
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const onClick = async () => {
    if (beforeExec) {
      clearTerminal(terminalInstanceRef.current!);
      terminalInstanceRef.current!.write(
        systemMessageColor("(初期化しています...しばらくお待ちください)")
      );
      await beforeExec();
    }
    clearTerminal(terminalInstanceRef.current!);
    terminalInstanceRef.current!.write(systemMessageColor("実行中です..."));
    setIsExecuting(true);
    const outputs = await exec();
    setIsExecuting(false);
    clearTerminal(terminalInstanceRef.current!);
    writeOutput(terminalInstanceRef.current!, outputs, false);
    // TODO: 1つのファイル名しか受け付けないところに無理やりコンマ区切りで全部のファイル名を突っ込んでいる
    sectionContext?.setExecResult(props.filenames.join(","), outputs);
  };
  return (
    <div className="relative">
      <div>
        <button
          className="btn btn-soft btn-primary rounded-tl-lg rounded-none"
          onClick={onClick}
          disabled={!termReady || runtimeInitializing}
        >
          ▶ 実行
        </button>
        <code className="text-sm ml-4">{commandline}</code>
      </div>
      <div className="bg-base-300 p-4 pt-2 rounded-b-lg">
        <div ref={terminalRef} />
      </div>
      {(runtimeInitializing || isExecuting) && (
        <div className="absolute z-10 inset-0 cursor-wait" />
      )}
    </div>
  );
}
