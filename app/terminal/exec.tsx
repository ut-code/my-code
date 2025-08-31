"use client";

import { usePyodide } from "./python/pyodide";
import {
  clearTerminal,
  getRows,
  hideCursor,
  systemMessageColor,
  useTerminal,
} from "./terminal";
import { useSectionCode } from "../[docs_id]/section";
import { useWandbox } from "./wandbox/wandbox";
import { ReplOutput, writeOutput } from "./repl";
import { useState } from "react";

export type ExecLang = "python" | "cpp";

interface ExecProps {
  /*
   * Pythonの場合はメインファイル1つのみを指定する。
   * C++の場合はソースコード(.cpp)とヘッダー(.h)を全部指定し、ExecFile内で拡張子を元にソースコードと追加コードを分ける。
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
  const sectionContext = useSectionCode();

  const pyodide = usePyodide();
  const wandbox = useWandbox();

  // 表示するコマンドライン文字列
  let commandline: string;
  // trueの間 (初期化しています...) と表示される
  let runtimeInitializing: boolean;
  // 初期化処理が必要な場合の関数
  let beforeExec: (() => Promise<void>) | null = null;
  // 実行中です... と表示される
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  // 実際に実行する関数
  let exec: (() => Promise<ReplOutput[]>) | null = null;
  switch (props.language) {
    case "python":
      if (props.filenames.length !== 1) {
        throw new Error("Pythonの実行にはファイル名が1つ必要です");
      }
      commandline = `python ${props.filenames[0]}`;
      runtimeInitializing = pyodide.initializing;
      beforeExec = pyodide.ready ? null : pyodide.init;
      exec = () => pyodide.runFile(props.filenames[0]);
      break;
    case "cpp":
      if (!props.filenames || props.filenames.length === 0) {
        throw new Error("C++の実行には filenames プロパティが必要です");
      }
      commandline = wandbox.cppOptions
        ? `${wandbox.cppOptions.commandline} ${props.filenames.join(" ")} && ./a.out`
        : "";
      runtimeInitializing = false;
      const namesSource = props.filenames!.filter((name) =>
        name.endsWith(".cpp")
      );
      const namesAdditional = props.filenames!.filter(
        (name) => !name.endsWith(".cpp")
      );
      exec = () => wandbox.runFiles("C++", namesSource, namesAdditional);
      break;
    default:
      props.language satisfies never;
      commandline = `エラー: 非対応の言語 ${props.language}`;
      runtimeInitializing = false;
      break;
  }

  const onClick = async () => {
    if (exec) {
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
    }
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
