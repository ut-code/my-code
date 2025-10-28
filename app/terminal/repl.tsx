"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { emptyMutex, RuntimeLang, useRuntime } from "./runtime";

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
  language: RuntimeLang;
  initContent?: string; // markdownで書かれている内容 (初期化時に実行するコマンドを含む文字列)
}
export function ReplTerminal({
  terminalId,
  language,
  initContent,
}: ReplComponentProps) {
  const { addReplOutput } = useEmbedContext();

  const {
    ready: runtimeReady,
    tabSize,
    mutex: runtimeMutex = emptyMutex,
    interrupt: runtimeInterrupt,
    runCommand,
    checkSyntax,
    splitReplExamples,
    prompt = "> ",
    promptMore = prompt,
  } = useRuntime(language);

  if (!runCommand) {
    throw new Error(`runCommand not available for language: ${language}`);
  }

  const initCommand = splitReplExamples?.(initContent || "");

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
      if (initCommand) {
        for (const cmd of initCommand) {
          updateBuffer(() => cmd.command.split("\n"));
          terminalInstanceRef.current!.writeln("");
          inputBuffer.current = [];
          handleOutput(cmd.output);
        }
      }
      terminalInstanceRef.current!.scrollToTop();
    },
  });

  // REPLのユーザー入力
  const inputBuffer = useRef<string[]>([]);

  // inputBufferを更新し、画面に描画する
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

  // ランタイムからのoutputを描画し、inputBufferをリセット
  const handleOutput = useCallback(
    (outputs: ReplOutput[]) => {
      if (terminalInstanceRef.current) {
        writeOutput(terminalInstanceRef.current, outputs, true);
        // 出力が終わったらプロンプトを表示
        updateBuffer(() => [""]);
      }
    },
    [updateBuffer, terminalInstanceRef]
  );

  const keyHandler = useCallback(
    async (key: string) => {
      if (terminalInstanceRef.current) {
        for (let i = 0; i < key.length; i++) {
          const code = key.charCodeAt(i);
          const isLastChar = i === key.length - 1;

          // inputBufferは必ず1行以上ある状態にする
          if (code === 3) {
            // Ctrl+C
            if (runtimeInterrupt) {
              runtimeInterrupt();
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
              const outputs = await runtimeMutex.runExclusive(() =>
                runCommand(command)
              );
              handleOutput(outputs);
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
      runtimeInterrupt,
      checkSyntax,
      updateBuffer,
      runtimeMutex,
      runCommand,
      handleOutput,
      tabSize,
      addReplOutput,
      terminalId,
      terminalInstanceRef,
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

  // ユーザーがクリックした時(triggered) && ランタイムが準備できた時に、実際にinitCommandを実行する(executing)
  const [initCommandState, setInitCommandState] = useState<
    "idle" | "triggered" | "executing" | "done"
  >("idle");
  useEffect(() => {
    if (
      terminalInstanceRef.current &&
      termReady &&
      runtimeReady &&
      initCommandState === "triggered"
    ) {
      setInitCommandState("executing");
      (async () => {
        if (initCommand) {
          // 初期化時に実行するコマンドがある場合はそれを実行
          const initCommandResult: ReplCommand[] = [];
          await runtimeMutex.runExclusive(async () => {
            for (const cmd of initCommand!) {
              const outputs = await runCommand(cmd.command);
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
            handleOutput(cmd.output);
          }
        }
        updateBuffer(() => [""]);
        // なぜかそのままscrollToTop()を呼ぶとスクロールせず、setTimeoutを入れるとscrollする(治安bad)
        setTimeout(() => terminalInstanceRef.current!.scrollToTop());
        setInitCommandState("done");
      })();
    }
  }, [
    initCommandState,
    runtimeReady,
    initCommand,
    runCommand,
    runtimeMutex,
    updateBuffer,
    handleOutput,
    termReady,
    terminalInstanceRef,
  ]);

  return (
    <div className={"relative h-max"}>
      {terminalInstanceRef.current &&
        termReady &&
        initCommandState === "idle" && (
          <div
            className="absolute z-10 inset-0 cursor-pointer"
            onClick={() => {
              if (!runtimeReady) {
                hideCursor(terminalInstanceRef.current!);
                terminalInstanceRef.current!.write(
                  systemMessageColor(
                    "(初期化しています...しばらくお待ちください)"
                  )
                );
                terminalInstanceRef.current!.focus();
              }
              setInitCommandState("triggered");
            }}
          />
        )}
      {(initCommandState === "triggered" ||
        initCommandState === "executing") && (
        <div className="absolute z-10 inset-0 cursor-wait" />
      )}
      <div ref={terminalRef} />
    </div>
  );
}
