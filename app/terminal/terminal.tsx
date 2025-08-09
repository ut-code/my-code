"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

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
  const inputBuffer = useRef<string[]>([""]);

  const initMessage = useRef<string>(null!);
  initMessage.current = props.initMessage;
  const prompt = useRef<string>(null!);
  prompt.current = props.prompt;
  const promptMore = useRef<string>(null!);
  promptMore.current = props.promptMore || props.prompt;
  const sendCommand = useRef<(command: string) => Promise<TerminalOutput[]>>(
    null!
  );
  sendCommand.current = props.sendCommand;
  const checkSyntax = useRef<(code: string) => Promise<SyntaxStatus>>(null!);
  checkSyntax.current = props.checkSyntax || (async () => "complete");

  useEffect(() => {
    if (terminalInstanceRef.current && termReady && props.ready) {
      // 初期メッセージとプロンプトを表示
      terminalInstanceRef.current.writeln(initMessage.current);
      terminalInstanceRef.current.write(prompt.current);
    }
  }, [props.ready, termReady]);

  // ターミナルの初期化処理
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
    });
    terminalInstanceRef.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    setTermReady(true);
    // TODO: loadingメッセージ
    // TODO: ターミナルのサイズ変更に対応する

    const onOutput = (outputs: TerminalOutput[]) => {
      for (const output of outputs) {
        // 出力内容に応じて色を変える
        const message = String(output.message).replace(/\n/g, "\r\n");
        switch (output.type) {
          case "stderr":
          case "error":
            term.writeln(`\x1b[1;31m${message}\x1b[0m`);
            break;
          default:
            term.writeln(message);
            break;
        }
      }
      // 出力が終わったらプロンプトを表示
      term.write(prompt.current);
    };

    // キー入力のハンドリング
    const onDataHandler = term.onData(async (key) => {
      const code = key.charCodeAt(0);

      // inputBufferは必ず1行以上ある状態にする
      if (code === 13) {
        // Enter
        const hasContent =
          inputBuffer.current[inputBuffer.current.length - 1].trim().length > 0;
        const status = await checkSyntax.current(
          inputBuffer.current.join("\n")
        );
        if (
          (inputBuffer.current.length === 1 && status === "incomplete") ||
          (inputBuffer.current.length >= 2 && hasContent)
        ) {
          // 次の行に続く
          term.writeln("");
          term.write(promptMore.current);
          inputBuffer.current.push("");
        } else {
          // 実行
          term.writeln("");
          const outputs = await sendCommand.current(
            inputBuffer.current.join("\n").trim()
          );
          onOutput(outputs);
          inputBuffer.current = [""];
        }
      } else if (code === 127) {
        // Backspace
        if (inputBuffer.current[inputBuffer.current.length - 1].length > 0) {
          term.write("\b \b");
          inputBuffer.current[inputBuffer.current.length - 1] =
            inputBuffer.current[inputBuffer.current.length - 1].slice(0, -1);
        }
      } else if (code >= 32) {
        inputBuffer.current[inputBuffer.current.length - 1] += key;
        term.write(key);
      }
    });

    // アンマウント時のクリーンアップ
    return () => {
      onDataHandler.dispose();
      term.dispose();
    };
  }, [initMessage, prompt, promptMore]);

  return <div ref={terminalRef} style={{ width: "100%", height: "400px" }} />;
}
