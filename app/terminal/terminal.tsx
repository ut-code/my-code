"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { highlightCodeToAnsi } from "./highlight";
import chalk from "chalk";

export interface TerminalOutput {
  type: "stdout" | "stderr" | "error" | "return"; // 出力の種類
  message: string; // 出力メッセージ
}
export type SyntaxStatus = "complete" | "incomplete" | "invalid"; // 構文チェックの結果

interface TerminalComponentProps {
  ready: boolean;
  initMessage: string; // ターミナル初期化時のメッセージ
  prompt: string; // プロンプト文字列
  promptMore?: string;
  language?: string;
  tabSize: number;
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

  const { prompt, promptMore, language, tabSize, sendCommand, checkSyntax } =
    props;

  // ターミナルの初期化処理
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      cursorStyle: "bar",
      cursorInactiveStyle: "none",
      theme: {
        // DaisyUIの変数を使用してテーマを設定している
        // TODO: ダークテーマ/ライトテーマを切り替えたときに再設定する?
        // TODO: red, green, blueなどの色も設定する
        background: window.getComputedStyle(document.body).getPropertyValue("--color-base-300"),
        foreground: window.getComputedStyle(document.body).getPropertyValue("--color-base-content"),
        cursor: window.getComputedStyle(document.body).getPropertyValue("--color-base-content"),
        selectionBackground: window.getComputedStyle(document.body).getPropertyValue("--color-primary"),
        selectionForeground: window.getComputedStyle(document.body).getPropertyValue("--color-primary-content"),
      },
    });
    terminalInstanceRef.current = term;
    initDone.current = false;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    setTermReady(true);
    // TODO: loadingメッセージ
    // TODO: ターミナルのサイズ変更に対応する

    return () => {
      term.dispose();
      terminalInstanceRef.current = null;
    };
  }, []);

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

  const initDone = useRef<boolean>(false);
  useEffect(() => {
    if (
      terminalInstanceRef.current &&
      termReady &&
      props.ready &&
      !initDone.current
    ) {
      // 初期メッセージとプロンプトを表示
      terminalInstanceRef.current.writeln(props.initMessage);
      initDone.current = true;
      updateBuffer(() => [""]);
    }
  }, [props.ready, termReady, props.initMessage, updateBuffer]);

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
              const outputs = await sendCommand(command);
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
    [updateBuffer, sendCommand, onOutput, checkSyntax, tabSize]
  );
  useEffect(() => {
    if (terminalInstanceRef.current && termReady && props.ready) {
      // キー入力のハンドリング
      const onDataHandler = terminalInstanceRef.current.onData(keyHandler);

      // アンマウント時のクリーンアップ
      return () => {
        onDataHandler.dispose();
      };
    }
  }, [keyHandler, termReady, props.ready]);

  return <div ref={terminalRef} style={{ width: "100%", height: "400px" }} />;
}
