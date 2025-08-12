"use client";

import { useMemo } from "react";
import { ReplTerminal, ReplOutput } from "../repl";
import { usePyodide } from "./pyodide";

export function PythonEmbeddedTerminal({ content }: { content: string }) {
  const initCommands = useMemo(() => splitContents(content), [content]);
  const { init, initializing, ready, runPython, checkSyntax, mutex } = usePyodide();

  return (
    <ReplTerminal
      initRuntime={init}
      runtimeInitializing={initializing}
      runtimeReady={ready}
      initCommand={initCommands}
      mutex={mutex}
      prompt=">>> "
      promptMore="... "
      language="python"
      tabSize={4}
      sendCommand={runPython}
      checkSyntax={checkSyntax}
    />
  );
}

function splitContents(
  contents: string
): { command: string; output: ReplOutput[] }[] {
  const initCommands: { command: string; output: ReplOutput[] }[] = [];
  for (const line of contents.split("\n")) {
    if (line.startsWith(">>> ")) {
      // Remove the prompt from the command
      initCommands.push({ command: line.slice(4), output: [] });
    } else if (line.startsWith("... ")) {
      if (initCommands.length > 0) {
        initCommands[initCommands.length - 1].command += "\n" + line.slice(4);
      }
    } else {
      // プロンプトを含まない行は前のコマンドの出力
      if (initCommands.length > 0) {
        initCommands[initCommands.length - 1].output.push({
          type: "stdout",
          message: line,
        });
      }
    }
  }
  return initCommands;
}
