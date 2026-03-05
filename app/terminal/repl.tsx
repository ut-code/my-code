"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { highlightCodeToAnsi, importPrism } from "./highlight";
import chalk from "chalk";
chalk.level = 3;
import {
  calculateRows,
  clearTerminal,
  hideCursor,
  showCursor,
  systemMessageColor,
  useTerminal,
} from "./terminal";
import type { Terminal } from "@xterm/xterm";
import { useEmbedContext } from "./embedContext";
import { LangConstants } from "@my-code/runtime/languages";
import clsx from "clsx";
import { InlineCode } from "@/[lang]/[pageId]/markdown";
import { emptyMutex, ReplCommand, ReplOutput } from "@my-code/runtime/interface";
import { useRuntime } from "@my-code/runtime/context";
import { MinMaxButton, Modal } from "./modal";
import { StopButtonContent } from "./exec";


export function writeOutput(
  term: Terminal,
  output: ReplOutput,
  returnPrefix: string | undefined,
  Prism: typeof import("prismjs") | null,
  language: LangConstants
) {
  // 出力内容に応じて色を変える
  const message = String(output.message).replace(/\n/g, "\r\n");
  switch (output.type) {
    case "error":
      term.writeln(chalk.red(message));
      break;
    case "trace":
      term.writeln(chalk.blue.italic(message));
      break;
    case "system":
      term.writeln(systemMessageColor(message));
      break;
    case "return":
      if (returnPrefix) {
        term.write(returnPrefix);
      }
      if (Prism) {
        term.writeln(highlightCodeToAnsi(Prism, message, language));
      } else {
        console.warn("Prism is not loaded, cannot highlight return value");
        term.writeln(message);
      }
      break;
    default:
      term.writeln(message);
      break;
  }
}

interface ReplComponentProps {
  terminalId: string;
  language: LangConstants;
  initContent?: string; // markdownで書かれている内容 (初期化時に実行するコマンドを含む文字列)
}
export function ReplTerminal({
  terminalId,
  language,
  initContent,
}: ReplComponentProps) {
  const { addReplCommand, addReplOutput, writeFile } = useEmbedContext();

  const [Prism, setPrism] = useState<typeof import("prismjs") | null>(null);
  useEffect(() => {
    if (Prism === null) {
      importPrism().then((prism) => setPrism(prism));
    }
  }, [Prism]);

  if (language.runtime === undefined) {
    throw new Error(
      `Language ${language.originalLang} does not have a runtime environment.`
    );
  }

  const {
    ready: runtimeReady,
    mutex: runtimeMutex = emptyMutex,
    interrupt: runtimeInterrupt,
    runCommand,
    checkSyntax,
    splitReplExamples,
    runtimeInfo,
  } = useRuntime(language.runtime);
  const { tabSize, prompt, promptMore, returnPrefix } = language;
  if (!prompt) {
    console.warn(`prompt not defined for language: ${language}`);
  }

  if (!runCommand) {
    throw new Error(`runCommand not available for language: ${language}`);
  }

  const initCommand = useMemo(
    () => splitReplExamples?.(initContent || ""),
    [splitReplExamples, initContent]
  );

  // REPLのユーザー入力
  const inputBuffer = useRef<string[]>([]);

  // ターミナルの行数を計算するためのstate
  const [newContents, setNewContents] = useState("\n");
  const [isModal, setIsModal] = useState(false);
  const [fontSize, setFontSize] = useState<number>();
  const [windowHeight, setWindowHeight] = useState<number>(1000);
  useEffect(() => {
    const update = () => {
      setFontSize(
        parseFloat(getComputedStyle(document.documentElement).fontSize)
      ); // 1rem
      setWindowHeight(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const getRows = useCallback(
    (cols: number) => {
      let rows = 0;
      for (const cmd of initCommand || []) {
        // コマンドの行数をカウント
        for (const line of cmd.command.split("\n")) {
          rows += calculateRows(prompt + line, cols);
        }
        // 出力の行数をカウント
        for (const out of cmd.output) {
          rows += calculateRows(out.message, cols);
        }
      }
      for (const line of newContents.trim().split("\n")) {
        rows += calculateRows(line, cols);
      }
      // 最後のプロンプト行を含める
      rows += Math.max(
        2,
        inputBuffer.current.reduce(
          (sum, line) => sum + calculateRows(prompt + line, cols),
          0
        )
      );
      return isModal
        ? "fit"
        : Math.min(
            rows,
            Math.floor((windowHeight * 0.5) / ((fontSize || 16) * 1.2))
          );
    },
    [initCommand, prompt, newContents, fontSize, isModal, windowHeight]
  );
  const { terminalRef, terminalInstanceRef, termReady } = useTerminal({
    getRows,
  });

  const [executionState, setExecutionState] = useState<"idle" | "executing">(
    "idle"
  );

  // inputBufferを更新し、画面に描画する
  const updateBuffer = useCallback(
    (newBuffer: (() => string[]) | null, insertBefore?: () => void) => {
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
        // バッファの前に追加で出力する内容(前のコマンドの出力)があればここで書き込む
        insertBefore?.();
        // 新しいバッファの内容を表示、nullなら現状維持
        if (newBuffer) {
          inputBuffer.current = newBuffer();
        }
        for (let i = 0; i < inputBuffer.current.length; i++) {
          terminalInstanceRef.current.write(
            (i === 0 ? prompt : (promptMore ?? prompt)) ?? "> "
          );
          if (language) {
            if (Prism) {
              terminalInstanceRef.current.write(
                highlightCodeToAnsi(Prism, inputBuffer.current[i], language)
              );
            } else {
              console.warn("Prism is not loaded, cannot highlight input code");
              terminalInstanceRef.current.write(inputBuffer.current[i]);
            }
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
    [Prism, prompt, promptMore, language, terminalInstanceRef]
  );

  // ランタイムからのoutputを描画し、inputBufferをリセット
  const handleOutput = useCallback(
    (output: ReplOutput) => {
      if (terminalInstanceRef.current) {
        writeOutput(
          terminalInstanceRef.current,
          output,
          returnPrefix,
          Prism,
          language
        );
      }
    },
    [Prism, terminalInstanceRef, returnPrefix, language]
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
            const status = checkSyntax
              ? await checkSyntax(inputBuffer.current.join("\n"))
              : "complete";
            if (status === "incomplete" || !isLastChar) {
              // 次の行に続く
              updateBuffer(() => [...inputBuffer.current, ""]);
            } else {
              // 実行
              terminalInstanceRef.current.writeln("");
              const command = inputBuffer.current.join("\n").trim();
              inputBuffer.current = [];
              setNewContents((contents) => contents + prompt + command + "\n");
              const commandId = addReplCommand(terminalId, command);
              setExecutionState("executing");
              let executionDone = false;
              await runtimeMutex.runExclusive(async () => {
                await runCommand(command, (output) => {
                  if (output.type === "file") {
                    writeFile({ [output.filename]: output.content });
                    return;
                  }
                  if (executionDone) {
                    // すでに完了していて次のコマンドのプロンプトが出ている場合、その前に挿入
                    updateBuffer(null, () => {
                      handleOutput(output);
                    });
                  } else {
                    handleOutput(output);
                  }
                  setNewContents(
                    (contents) => contents + output.message + "\n"
                  );
                  addReplOutput(terminalId, commandId, output);
                });
              });
              setExecutionState("idle");
              executionDone = true;
              updateBuffer(() => [""]);
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
            const spaces = " ".repeat(tabSize ?? 4);
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
      writeFile,
      tabSize,
      addReplCommand,
      addReplOutput,
      terminalId,
      terminalInstanceRef,
      prompt,
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

  const [initCommandState, setInitCommandState] = useState<
    "initializing" | "idle" | "triggered" | "executing" | "done"
  >("initializing");
  useEffect(() => {
    if (
      terminalInstanceRef.current &&
      termReady &&
      Prism &&
      initCommandState === "initializing"
    ) {
      // xtermの初期化とPrismの読み込みが完了したら、initCommandを実行せず描画する
      if (initCommand) {
        for (const cmd of initCommand) {
          updateBuffer(() => cmd.command.split("\n"));
          terminalInstanceRef.current!.writeln("");
          inputBuffer.current = [];
          for (const output of cmd.output) {
            handleOutput(output);
          }
          updateBuffer(() => [""]);
        }
      } else {
        updateBuffer(() => [""]);
      }
      terminalInstanceRef.current!.scrollToTop();
      setInitCommandState("idle");
    } else if (
      terminalInstanceRef.current &&
      termReady &&
      runtimeReady &&
      initCommandState === "triggered"
    ) {
      // ユーザーがクリックした時(triggered) && ランタイムが準備できた時に、実際にinitCommandを実行する(executing)
      setInitCommandState("executing");
      (async () => {
        if (initCommand) {
          // 初期化時に実行するコマンドがある場合はそれを実行
          const initCommandResult: ReplCommand[] = [];
          await runtimeMutex.runExclusive(async () => {
            for (const cmd of initCommand!) {
              const outputs: ReplOutput[] = [];
              await runCommand(cmd.command, (output) => {
                if (output.type === "file") {
                  writeFile({ [output.filename]: output.content });
                  return;
                }
                outputs.push(output);
              });
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
            for (const output of cmd.output) {
              handleOutput(output);
            }
            updateBuffer(() => [""]);
          }
        }
        updateBuffer(() => [""]);
        // なぜかそのままscrollToTop()を呼ぶとスクロールせず、setTimeoutを入れるとscrollする(治安bad)
        setTimeout(() => terminalInstanceRef.current!.scrollToTop());
        setInitCommandState("done");
        terminalInstanceRef.current?.focus();
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
    writeFile,
    termReady,
    terminalInstanceRef,
    Prism,
  ]);

  const [showStopButton, setShowStopButton] = useState(false);
  useEffect(() => {
    if (
      !termReady ||
      initCommandState !== "done" ||
      executionState !== "executing"
    ) {
      setShowStopButton(false);
    } else {
      // 一瞬で実行が完了するなら表示しない
      const timeout = setTimeout(() => setShowStopButton(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [termReady, initCommandState, executionState]);
  return (
    <Modal
      id={"repl-" + terminalId}
      className={clsx("bg-base-300", "flex flex-col", "isolate")}
      open={isModal}
      setOpen={setIsModal}
    >
      <div className="bg-base-200 w-full overflow-x-clip overflow-y-visible flex items-center rounded-t-box">
        <button
          /* daisyuiのbtnはheightがvar(--size)で固定。
          ここでは最小でそのサイズ、ただし親コンテナがそれより大きい場合に大きくしたい
          → heightを解除し、min-heightをデフォルトのサイズと同じにする */
          className={clsx(
            "btn btn-soft btn-error h-[unset]! min-h-(--size) self-stretch",
            "rounded-none rounded-tl-[calc(var(--radius-box)-2px)]",
            !showStopButton && "hidden"
          )}
          onClick={() => {
            // Ctrl+C
            if (terminalInstanceRef.current && runtimeInterrupt) {
              runtimeInterrupt();
              terminalInstanceRef.current.write("^C");
            }
          }}
          /*disabled={
            !termReady ||
            initCommandState !== "done" ||
            executionState !== "executing"
          }*/
        >
          <StopButtonContent />
        </button>
        <span className="text-sm my-1 ml-3 text-left">
          {runtimeInfo?.prettyLangName || language.runtime} 実行環境
        </span>
        <div className="ml-1 tooltip tooltip-secondary tooltip-bottom z-1">
          <div className="tooltip-content bg-secondary/60 backdrop-blur-xs">
            ブラウザ上で動作する
            <span className="mx-0.5">
              {runtimeInfo?.prettyLangName || language.runtime}
            </span>
            {runtimeInfo?.version && (
              <span className="mr-0.5">{runtimeInfo?.version}</span>
            )}
            のREPL実行環境です。
            <br />
            プロンプト (<InlineCode>{prompt?.trimEnd()}</InlineCode>)
            の後にコマンドを入力し、
            <kbd className="kbd kbd-sm text-base-content">Enter</kbd>
            キーで実行します。
            <br />
            <kbd className="kbd kbd-sm text-base-content">Ctrl</kbd>+
            <kbd className="kbd kbd-sm text-base-content">C</kbd>
            または左上の停止ボタンで実行中のコマンドを中断できます。
          </div>
          <button
            className={clsx(
              "btn btn-xs btn-soft btn-secondary rounded-full cursor-help"
            )}
          >
            ？
          </button>
        </div>
        <div className="flex-1" />
        <MinMaxButton open={isModal} id={`repl-${terminalId}`} />
      </div>
      {/*
      ターミナル表示の初期化が完了するまでの間、ターミナルは隠し、内容をそのまま表示する。
      可能な限りレイアウトが崩れないようにするため & SSRでも内容が読めるように(SEO?)という意味もある
      */}
      <div className="flex-1 w-full overflow-hidden bg-base-300 relative p-4 pr-1 pt-2 rounded-b-box">
        <pre
          className={clsx(
            "font-mono whitespace-pre-line cursor-wait",
            "pr-3",
            "min-h-26", // xterm.jsで5行分の高さ
            initCommandState !== "initializing" && "hidden"
          )}
        >
          {initContent + "\n\n"}
        </pre>
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
        <div
          className={clsx(
            initCommandState === "initializing" &&
              /* "hidden" だとterminalがdivのサイズを取得しようとしたときにバグる*/
              "absolute invisible",
            "w-full h-full"
          )}
          ref={terminalRef}
          onTouchEnd={() => terminalInstanceRef.current?.focus()}
        />
      </div>
    </Modal>
  );
}
