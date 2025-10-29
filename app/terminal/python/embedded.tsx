"use client";

import { useMemo } from "react";
import { ReplTerminal, ReplOutput, ReplCommand } from "../repl";
import { usePyodide } from "./pyodide";

export function PythonEmbeddedTerminal({
  terminalId,
  content,
}: {
  terminalId: string;
  content: string;
}) {
  const initCommands = useMemo(() => splitContents(content), [content]);
  const {
    init,
    initializing,
    ready,
    runPython,
    checkSyntax,
    mutex,
    interrupt,
  } = usePyodide();

  return (
    <ReplTerminal
      terminalId={terminalId}
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
      interrupt={interrupt}
    />
  );
}

function splitContents(contents: string): ReplCommand[] {
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
