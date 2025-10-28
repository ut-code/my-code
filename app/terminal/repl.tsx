"use client";

import { useCallback, useEffect, useRef, useMemo } from "react";
import { highlightCodeToAnsi } from "./highlight";
import chalk from "chalk";
import {
  clearTerminal,
  getRows,
  hideCursor,
  showCursor,
  systemMessageColor,
  useTerminal,
} from "./terminal";
import { Terminal } from "@xterm/xterm";
import { useEmbedContext } from "./embedContext";
import { useRuntime } from "./runtime";

export interface ReplOutput {
  type: "stdout" | "stderr" | "error" | "return" | "trace" | "system"; // 出力の種類
  message: string; // 出力メッセージ
}
export interface ReplCommand {
  command: string;
  output: ReplOutput[];
}
export type SyntaxStatus = "complete" | "incomplete" | "invalid"; // 構文チェックの結果

export function writeOutput(
  term: Terminal,
  outputs: ReplOutput[],
  endNewLine: boolean
) {
  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i];
    if (i > 0) {
      term.writeln("");
    }
    // 出力内容に応じて色を変える
    const message = String(output.message).replace(/\n/g, "\r\n");
    switch (output.type) {
      case "error":
        term.write(chalk.red(message));
        break;
      case "trace":
        term.write(chalk.blue.italic(message));
        break;
      case "system":
        term.write(systemMessageColor(message));
        break;
      default:
        term.write(message);
        break;
    }
  }
  if (endNewLine && outputs.length > 0) {
    term.writeln("");
  }
}

interface ReplComponentProps {
  terminalId: string;
  language: string;
  initMessage?: string; // ターミナル初期化時のメッセージ
  content?: string; // 初期化時に実行するコマンドを含むコンテンツ (embedded.tsxの代替)
  initCommand?: ReplCommand[]; // 初期化時に実行するコマンドとその出力
}
export function ReplTerminal(props: ReplComponentProps) {
  const inputBuffer = useRef<string[]>([]);
  const initDone = useRef<boolean>(false);

  const sectionContext = useEmbedContext();
  const addReplOutput = sectionContext?.addReplOutput;

  const runtime = useRuntime(props.language);
  const {
    init: initRuntime,
    initializing: runtimeInitializing,
    ready: runtimeReady,
    checkSyntax,
    interrupt,
    splitContents,
    prompt = ">>> ",
    promptMore,
    tabSize = 4,
  } = runtime;

  // content が指定されている場合は splitContents を使用
  const initCommand = useMemo(() => {
    if (props.content && splitContents) {
      return splitContents(props.content);
    }
    return props.initCommand;
  }, [props.content, props.initCommand, splitContents]);

  const sendCommand = useCallback(
    async (command: string) => {
      // Use runCommand if available (for REPL), otherwise use runFiles
      if (runtime.runCommand) {
        return runtime.runCommand(command);
      }
      // Fallback for languages without REPL support
      return runtime.runFiles([command]);
    },
    [runtime]
  );

  const { terminalId, language } = props;

  const { terminalRef, terminalInstanceRef, termReady } = useTerminal({
    getRows: (cols: number) => {
      let rows = 0;
      for (const cmd of initCommand || []) {
        // コマンドの行数をカウント
        for (const line of cmd.command.split("\n")) {
          rows += getRows(prompt + line, cols);
        }
        // 出力の行数をカウント
        for (const out of cmd.output) {
          rows += getRows(out.message, cols);
        }
      }
      return rows + 2; // 最後のプロンプト行を含める
    },
    onReady: () => {
      initDone.current = false;
      if (initCommand) {
        for (const cmd of initCommand) {
          updateBuffer(() => cmd.command.split("\n"));
          terminalInstanceRef.current!.writeln("");
          inputBuffer.current = [];
          onOutput(cmd.output);
        }
      }
      terminalInstanceRef.current!.scrollToTop();
    },
  });

  // bufferを更新し、画面に描画する
  const updateBuffer = useCallback(
    (newBuffer: () => string[]) => {
      if (terminalInstanceRef.current) {
        hideCursor(terminalInstanceRef.current);
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
        showCursor(terminalInstanceRef.current);
      }
    },
    [prompt, promptMore, language, terminalInstanceRef]
  );

  // ランタイムからの出力を処理し、bufferをリセット
  const onOutput = useCallback(
    (outputs: ReplOutput[]) => {
      if (terminalInstanceRef.current) {
        writeOutput(terminalInstanceRef.current, outputs, true);
        // 出力が終わったらプロンプトを表示
        updateBuffer(() => [""]);
      }
    },
    [updateBuffer, terminalInstanceRef]
  );

  useEffect(() => {
    if (
      terminalInstanceRef.current &&
      termReady &&
      runtimeReady &&
      !initDone.current
    ) {
      initDone.current = true;
      if (props.initMessage) {
        clearTerminal(terminalInstanceRef.current);
        terminalInstanceRef.current.writeln(props.initMessage);
      }
      (async () => {
        if (initCommand) {
          // 初期化時に実行するコマンドがある場合はそれを実行
          const initCommandResult: ReplCommand[] = [];
          await runtime.mutex.runExclusive(async () => {
            for (const cmd of initCommand!) {
              const outputs = await sendCommand(cmd.command);
              initCommandResult.push({
                command: cmd.command,
                output: outputs,
              });
            }
          });
          // 実際の実行結果でターミナルを再描画
          clearTerminal(terminalInstanceRef.current!);
          for (const cmd of initCommandResult) {
            updateBuffer(() => cmd.command.split("\n"));
            terminalInstanceRef.current!.writeln("");
            inputBuffer.current = [];
            onOutput(cmd.output);
          }
        }
        updateBuffer(() => [""]);
        // なぜかそのままscrollToTop()を呼ぶとスクロールせず、setTimeoutを入れるとscrollする(治安bad)
        setTimeout(() => terminalInstanceRef.current!.scrollToTop());
      })();
    }
  }, [
    runtimeReady,
    termReady,
    props.initMessage,
    updateBuffer,
    onOutput,
    initCommand,
    sendCommand,
    runtime.mutex,
    terminalInstanceRef,
  ]);

  const keyHandler = useCallback(
    async (key: string) => {
      if (terminalInstanceRef.current) {
        for (let i = 0; i < key.length; i++) {
          const code = key.charCodeAt(i);
          const isLastChar = i === key.length - 1;

          // inputBufferは必ず1行以上ある状態にする
          if (code === 3) {
            // Ctrl+C
            if (interrupt) {
              interrupt();
              terminalInstanceRef.current.write("^C");
            }
          } else if (code === 13) {
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
              const outputs = await runtime.mutex.runExclusive(() =>
                sendCommand(command)
              );
              onOutput(outputs);
              addReplOutput?.(terminalId, command, outputs);
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
    [
      terminalId,
      updateBuffer,
      sendCommand,
      onOutput,
      checkSyntax,
      tabSize,
      runtime.mutex,
      terminalInstanceRef,
      addReplOutput,
      interrupt,
    ]
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
  }, [keyHandler, termReady, runtimeReady, terminalInstanceRef]);

  return (
    <div className={"relative h-max"}>
      {!runtimeInitializing && !runtimeReady && (
        <div
          className="absolute z-10 inset-0 cursor-pointer"
          onClick={() => {
            if (terminalInstanceRef.current && termReady) {
              initRuntime();
              hideCursor(terminalInstanceRef.current);
              terminalInstanceRef.current.write(
                systemMessageColor(
                  "(初期化しています...しばらくお待ちください)"
                )
              );
              terminalInstanceRef.current.focus();
            }
          }}
        />
      )}
      {runtimeInitializing && (
        <div className="absolute z-10 inset-0 cursor-wait" />
      )}
      <div ref={terminalRef} />
    </div>
  );
}
