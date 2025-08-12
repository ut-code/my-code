"use client";

import chalk from "chalk";
import { usePyodide } from "./python/pyodide";
import { clearTerminal, getRows, useTerminal } from "./terminal";

interface ExecProps {
  filename: string;
  language: string;
  content: string;
}
export function ExecFile(props: ExecProps) {
  const { terminalRef, terminalInstanceRef, termReady } = useTerminal({
    getRows: (cols: number) => getRows(props.content, cols),
    onReady: () => {
      // カーソル非表示
      terminalInstanceRef.current!.write("\x1b[?25l");
      for (const line of props.content.split("\n")) {
        terminalInstanceRef.current!.writeln(line);
      }
    },
  });

  const pyodide = usePyodide();

  let commandline: string;
  let exec: () => Promise<void> | void;
  let runtimeInitializing: boolean;
  switch (props.language) {
    case "python":
      commandline = `python ${props.filename}`;
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
        const outputs = await pyodide.runFile(props.filename);
        for (const output of outputs) {
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
      };
      break;
    default:
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
