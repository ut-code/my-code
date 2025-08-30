"use client";

import chalk from "chalk";
import { usePyodide } from "./python/pyodide";
import { clearTerminal, getRows, hideCursor, useTerminal } from "./terminal";
import { useSectionCode } from "../[docs_id]/section";
import { useWandbox } from "./wandbox/wandbox";

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

  let commandline: string;
  let exec: () => Promise<void> | void;
  let runtimeInitializing: boolean;
  switch (props.language) {
    case "python":
      if (props.filenames.length !== 1) {
        throw new Error("Pythonの実行にはファイル名が1つ必要です");
      }
      commandline = `python ${props.filenames[0]}`;
      runtimeInitializing = pyodide.initializing;
      exec = async () => {
        if (!pyodide.ready) {
          clearTerminal(terminalInstanceRef.current!);
          terminalInstanceRef.current!.write(
            chalk.dim.bold.italic("(初期化しています...しばらくお待ちください)")
          );
          await pyodide.init();
        }
        clearTerminal(terminalInstanceRef.current!);
        const outputs = await pyodide.runFile(props.filenames[0]);
        for (let i = 0; i < outputs.length; i++) {
          const output = outputs[i];
          if(i > 0) {
            terminalInstanceRef.current!.writeln("");
          }
          // 出力内容に応じて色を変える
          const message = String(output.message).replace(/\n/g, "\r\n");
          switch (output.type) {
            case "error":
              terminalInstanceRef.current!.writeln(chalk.red(message));
              break;
            default:
              terminalInstanceRef.current!.writeln(message);
              break;
          }
        }
        sectionContext?.setExecResult(props.filenames[0], outputs);
      };
      break;
    case "cpp":
      if (!props.filenames || props.filenames.length === 0) {
        throw new Error("C++の実行には filenames プロパティが必要です");
      }
      commandline = wandbox.cppOptions
        ? `${wandbox.cppOptions.commandline} ${props.filenames.join(" ")} && ./a.out`
        : "";
      runtimeInitializing = false;
      exec = async () => {
        clearTerminal(terminalInstanceRef.current!);
        const namesSource = props.filenames!.filter((name) =>
          name.endsWith(".cpp")
        );
        const namesAdditional = props.filenames!.filter(
          (name) => !name.endsWith(".cpp")
        );
        const outputs = await wandbox.runFiles(
          "C++",
          namesSource,
          namesAdditional
        );
        for (let i = 0; i < outputs.length; i++) {
          const output = outputs[i];
          if(i > 0) {
            terminalInstanceRef.current!.writeln("");
          }
          // 出力内容に応じて色を変える
          const message = String(output.message).replace(/\n/g, "\r\n");
          switch (output.type) {
            case "error":
              terminalInstanceRef.current!.write(chalk.red(message));
              break;
            default:
              terminalInstanceRef.current!.write(message);
              break;
          }
        }
        sectionContext?.setExecResult(props.filename!, outputs);
      };
      break;
    default:
      props.language satisfies never;
      commandline = `エラー: 非対応の言語 ${props.language}`;
      runtimeInitializing = false;
      exec = () => undefined;
      break;
  }
  return (
    <div className="relative">
      <div>
        <button
          className="btn btn-soft btn-primary rounded-tl-lg rounded-none"
          onClick={exec}
          disabled={!termReady || runtimeInitializing}
        >
          ▶ 実行
        </button>
        <code className="text-sm ml-4">{commandline}</code>
      </div>
      <div className="bg-base-300 p-4 pt-2 rounded-b-lg">
        <div ref={terminalRef} />
      </div>
      {runtimeInitializing && (
        <div className="absolute z-10 inset-0 cursor-wait" />
      )}
    </div>
  );
}
