"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { highlightCodeToAnsi } from "./highlight";
import chalk from "chalk";
import { MutexInterface } from "async-mutex";

export interface TerminalOutput {
  type: "stdout" | "stderr" | "error" | "return"; // 出力の種類
  message: string; // 出力メッセージ
}
export type SyntaxStatus = "complete" | "incomplete" | "invalid"; // 構文チェックの結果

interface TerminalComponentProps {
  initRuntime: () => void;
  runtimeInitializing: boolean;
  runtimeReady: boolean;
  initMessage?: string; // ターミナル初期化時のメッセージ
  initCommand?: { command: string; output: TerminalOutput[] }[]; // 初期化時に実行するコマンドとその出力
  prompt: string; // プロンプト文字列
  promptMore?: string;
  language?: string;
  tabSize: number;
  // コードブロックの実行全体を mutex.runExclusive() で囲うことで同時実行を防ぐ
  mutex: MutexInterface;
  // コマンド実行時のコールバック関数
  sendCommand: (command: string) => Promise<TerminalOutput[]>;
  // 構文チェックのコールバック関数
  // incompleteの場合は次の行に続くことを示す
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
}
export function TerminalComponent(props: TerminalComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null!);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const [termReady, setTermReady] = useState<boolean>(false);
  const inputBuffer = useRef<string[]>([]);

  const {
    initRuntime,
    runtimeInitializing,
    runtimeReady,
    prompt,
    promptMore,
    language,
    tabSize,
    sendCommand,
    checkSyntax,
    mutex,
  } = props;

  // bufferを更新し、画面に描画する
  const updateBuffer = useCallback(
    (newBuffer: () => string[]) => {
      if (terminalInstanceRef.current) {
        // カーソル非表示
        terminalInstanceRef.current.write("\x1b[?25l");
        // バッファの行数分カーソルを戻す
        if (inputBuffer.current.length >= 2) {
          terminalInstanceRef.current.write(
            `\x1b[${inputBuffer.current.length - 1}A`
          );
        }
        terminalInstanceRef.current.write("\r");
        // バッファの内容をクリア
        terminalInstanceRef.current.write("\x1b[0J");
        // 新しいバッファの内容を表示
        inputBuffer.current = newBuffer();
        for (let i = 0; i < inputBuffer.current.length; i++) {
          terminalInstanceRef.current.write(
            i === 0 ? prompt : promptMore || prompt
          );
          if (language) {
            terminalInstanceRef.current.write(
              highlightCodeToAnsi(inputBuffer.current[i], language)
            );
          } else {
            terminalInstanceRef.current.write(inputBuffer.current[i]);
          }
          if (i < inputBuffer.current.length - 1) {
            terminalInstanceRef.current.writeln("");
          }
        }
        // カーソルを表示
        terminalInstanceRef.current.write("\x1b[?25h");
      }
    },
    [prompt, promptMore, language]
  );

  // ランタイムからの出力を処理し、bufferをリセット
  const onOutput = useCallback(
    (outputs: TerminalOutput[]) => {
      if (terminalInstanceRef.current) {
        for (const output of outputs) {
          // 出力内容に応じて色を変える
          const message = String(output.message).replace(/\n/g, "\r\n");
          switch (output.type) {
            case "stderr":
            case "error":
              terminalInstanceRef.current.writeln(chalk.red(message));
              break;
            default:
              terminalInstanceRef.current.writeln(message);
              break;
          }
        }
        // 出力が終わったらプロンプトを表示
        updateBuffer(() => [""]);
      }
    },
    [updateBuffer]
  );

  // initCommandのコマンドについて、実行せずコマンドと結果の表示だけを事前にする
  const renderInitCommand = useRef<() => void>(null!);
  renderInitCommand.current = () => {
    if (props.initCommand) {
      for (const cmd of props.initCommand) {
        updateBuffer(() => cmd.command.split("\n"));
        terminalInstanceRef.current!.writeln("");
        inputBuffer.current = [];
        onOutput(cmd.output);
      }
    }
  };
  const [currentRows, setCurrentRows] = useState<number>(0);
  const getRowsOfInitCommand = useRef<(cols: number) => number>(null!);
  getRowsOfInitCommand.current = (cols: number) => {
    let rows = 0;
    for (const cmd of props.initCommand || []) {
      // コマンドの行数をカウント
      console.log(
        prompt + cmd.command,
        Math.max(1, Math.ceil(strWidth(prompt + cmd.command) / cols))
      );
      for (const line of cmd.command.split("\n")) {
        rows += Math.max(1, Math.ceil(strWidth(prompt + line) / cols));
      }
      // 出力の行数をカウント
      for (const out of cmd.output) {
        console.log(
          out.message,
          Math.max(1, Math.ceil(strWidth(out.message) / cols))
        );
        rows += Math.max(1, Math.ceil(strWidth(out.message) / cols));
      }
    }
    return rows + 2; // 最後のプロンプト行を含める
  };

  // ターミナルの初期化処理
  useEffect(() => {
    const fromCSS = (varName: string) =>
      window.getComputedStyle(document.body).getPropertyValue(varName);
    // "--color-" + color_name のように文字列を分割するとTailwindCSSが認識せずCSSの値として出力されない場合があるので注意
    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      cursorStyle: "bar",
      cursorInactiveStyle: "none",
      fontSize: 14,
      lineHeight: 1.4,
      letterSpacing: 0,
      fontFamily: "Inconsolata Variable",
      theme: {
        // DaisyUIの変数を使用してテーマを設定している
        // TODO: ダークテーマ/ライトテーマを切り替えたときに再設定する?
        background: fromCSS("--color-base-300"),
        foreground: fromCSS("--color-base-content"),
        cursor: fromCSS("--color-base-content"),
        selectionBackground: fromCSS("--color-primary"),
        selectionForeground: fromCSS("--color-primary-content"),
        black: fromCSS("--color-black"),
        brightBlack: fromCSS("--color-neutral-500"),
        red: fromCSS("--color-red-600"),
        brightRed: fromCSS("--color-red-400"),
        green: fromCSS("--color-green-600"),
        brightGreen: fromCSS("--color-green-400"),
        yellow: fromCSS("--color-yellow-700"),
        brightYellow: fromCSS("--color-yellow-400"),
        blue: fromCSS("--color-indigo-600"),
        brightBlue: fromCSS("--color-indigo-400"),
        magenta: fromCSS("--color-fuchsia-600"),
        brightMagenta: fromCSS("--color-fuchsia-400"),
        cyan: fromCSS("--color-cyan-600"),
        brightCyan: fromCSS("--color-cyan-400"),
        white: fromCSS("--color-base-100"),
        brightWhite: fromCSS("--color-white"),
      },
    });
    terminalInstanceRef.current = term;
    initDone.current = false;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    // fitAddon.fit();

    term.open(terminalRef.current);

    renderInitCommand.current();
    setTermReady(true);

    const observer = new ResizeObserver(() => {
      // fitAddon.fit();
      const dims = fitAddon.proposeDimensions();
      if (dims) {
        const rows = getRowsOfInitCommand.current(dims.cols);
        term.resize(dims.cols, rows);
        setCurrentRows(rows);
      }
    });
    observer.observe(terminalRef.current);

    return () => {
      observer.disconnect();
      term.dispose();
      terminalInstanceRef.current = null;
    };
  }, []);

  const initDone = useRef<boolean>(false);
  useEffect(() => {
    if (
      terminalInstanceRef.current &&
      termReady &&
      runtimeReady &&
      !initDone.current
    ) {
      initDone.current = true;
      if (props.initMessage) {
        terminalInstanceRef.current!.clear();
        terminalInstanceRef.current.writeln(props.initMessage);
      }
      (async () => {
        if (props.initCommand) {
          // 初期化時に実行するコマンドがある場合はそれを実行
          const initCommandResult: {
            command: string;
            output: TerminalOutput[];
          }[] = [];
          await mutex.runExclusive(async () => {
            for (const cmd of props.initCommand!) {
              const outputs = await sendCommand(cmd.command);
              initCommandResult.push({
                command: cmd.command,
                output: outputs,
              });
            }
          });
          // 実際の実行結果でターミナルを再描画
          terminalInstanceRef.current!.clear();
          for (const cmd of initCommandResult) {
            updateBuffer(() => cmd.command.split("\n"));
            terminalInstanceRef.current!.writeln("");
            inputBuffer.current = [];
            onOutput(cmd.output);
          }
        }
        updateBuffer(() => [""]);
      })();
    }
  }, [
    runtimeReady,
    termReady,
    props.initMessage,
    updateBuffer,
    onOutput,
    props.initCommand,
    sendCommand,
    mutex,
  ]);

  const keyHandler = useCallback(
    async (key: string) => {
      if (terminalInstanceRef.current) {
        for (let i = 0; i < key.length; i++) {
          const code = key.charCodeAt(i);
          const isLastChar = i === key.length - 1;

          // inputBufferは必ず1行以上ある状態にする
          if (code === 13) {
            // Enter
            const hasContent =
              inputBuffer.current[inputBuffer.current.length - 1].trim()
                .length > 0;
            const status = checkSyntax
              ? await checkSyntax(inputBuffer.current.join("\n"))
              : "complete";
            if (
              (inputBuffer.current.length === 1 && status === "incomplete") ||
              (inputBuffer.current.length >= 2 && hasContent) ||
              !isLastChar
            ) {
              // 次の行に続く
              updateBuffer(() => [...inputBuffer.current, ""]);
            } else {
              // 実行
              terminalInstanceRef.current.writeln("");
              const command = inputBuffer.current.join("\n").trim();
              inputBuffer.current = [];
              const outputs = await mutex.runExclusive(() =>
                sendCommand(command)
              );
              onOutput(outputs);
            }
          } else if (code === 127) {
            // Backspace
            if (
              inputBuffer.current[inputBuffer.current.length - 1].length > 0
            ) {
              updateBuffer(() => {
                const newBuffer = [...inputBuffer.current];
                newBuffer[newBuffer.length - 1] = newBuffer[
                  newBuffer.length - 1
                ].slice(0, -1);
                return newBuffer;
              });
            }
          } else if (code === 9) {
            // Tab
            // タブをスペースに変換
            const spaces = " ".repeat(tabSize);
            updateBuffer(() => {
              const newBuffer = [...inputBuffer.current];
              // 最後の行にスペースを追加
              newBuffer[newBuffer.length - 1] += spaces;
              return newBuffer;
            });
          } else if (code >= 32) {
            updateBuffer(() => {
              const newBuffer = [...inputBuffer.current];
              // 最後の行にキーを追加
              newBuffer[newBuffer.length - 1] += key[i];
              return newBuffer;
            });
          }
        }
      }
    },
    [updateBuffer, sendCommand, onOutput, checkSyntax, tabSize, mutex]
  );
  useEffect(() => {
    if (terminalInstanceRef.current && termReady && runtimeReady) {
      // キー入力のハンドリング
      const onDataHandler = terminalInstanceRef.current.onData(keyHandler);

      // アンマウント時のクリーンアップ
      return () => {
        onDataHandler.dispose();
      };
    }
  }, [keyHandler, termReady, runtimeReady]);

  return (
    <div
      className="relative p-4 bg-base-300 min-h-32 h-max"
      onClick={() => {
        if (
          !runtimeInitializing &&
          !runtimeReady &&
          terminalInstanceRef.current &&
          termReady
        ) {
          initRuntime();
          terminalInstanceRef.current.write(
            chalk.dim.bold.italic("(初期化しています...しばらくお待ちください)")
          );
        }
      }}
    >
      {runtimeInitializing && (
        <div className="absolute z-10 inset-0 cursor-wait" />
      )}
      <div ref={terminalRef} />
    </div>
  );
}

/**
 * 文字列の幅を計算する。
 * 厳密にやるなら @xterm/xterm/src/common/input/UnicodeV6.ts を使うとよさそう
 * (しかしそれをimportしても動かなかった)
 *
 * とりあえず日本語と英数を最低限区別するでっち上げ実装にしている
 *
 */
function strWidth(str: string): number {
  let len: number = 0;
  for (const char of str) {
    if (char.charCodeAt(0) < 0x2000) {
      len += 1;
    } else {
      len += 2;
    }
  }
  return len;
}
