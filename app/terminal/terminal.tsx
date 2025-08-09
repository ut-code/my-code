"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export interface TerminalOutput {
  type: "stdout" | "stderr" | "error" | "return"; // 出力の種類
  message: string; // 出力メッセージ
}
interface TerminalComponentProps {
  ready: boolean;
  initMessage: string; // ターミナル初期化時のメッセージ
  prompt: string; // プロンプト文字列
  sendCommand: (command: string) => Promise<TerminalOutput[]>; // コマンド実行時のコールバック関数
}
export function TerminalComponent(props: TerminalComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null!);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const [termReady, setTermReady] = useState<boolean>(false);
  const inputBuffer = useRef<string>("");

  const [initMessage] = useState<string>(props.initMessage);
  const [prompt] = useState<string>(props.prompt);
  const sendCommand = useRef<(command: string) => Promise<TerminalOutput[]>>(
    props.sendCommand
  );

  useEffect(() => {
    if (terminalInstanceRef.current && termReady && props.ready) {
      // 初期メッセージとプロンプトを表示
      terminalInstanceRef.current.writeln(initMessage);
      terminalInstanceRef.current.write(prompt);
    }
  }, [initMessage, prompt, props.ready, termReady]);

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
      term.write(prompt);
    };

    // キー入力のハンドリング
    const onDataHandler = term.onData((key) => {
      const code = key.charCodeAt(0);

      if (code === 13) {
        // Enter
        term.writeln("");
        if (inputBuffer.current.trim().length > 0) {
          sendCommand.current(inputBuffer.current).then(onOutput);
          inputBuffer.current = "";
        }
        // 新しいプロンプトは外部からのoutputを待ってから表示する
      } else if (code === 127) {
        // Backspace
        if (inputBuffer.current.length > 0) {
          term.write("\b \b");
          inputBuffer.current = inputBuffer.current.slice(0, -1);
        }
      } else if (code >= 32) {
        inputBuffer.current += key;
        term.write(key);
      }
    });

    // アンマウント時のクリーンアップ
    return () => {
      onDataHandler.dispose();
      term.dispose();
    };
  }, [initMessage, prompt]);

  return <div ref={terminalRef} style={{ width: "100%", height: "400px" }} />;
}
