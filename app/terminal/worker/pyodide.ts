"use client";

import { createContext, useContext } from "react";
import { RuntimeContext, RuntimeInfo } from "../runtime";
import { ReplCommand, ReplOutput } from "../repl";
import pyodideLock from "pyodide/pyodide-lock.json";

export const PyodideContext = createContext<RuntimeContext>(null!);

export function usePyodide() {
  const context = useContext(PyodideContext);
  if (!context) {
    throw new Error("usePyodide must be used within a PyodideProvider");
  }
  return {
    ...context,
    splitReplExamples,
    getCommandlineStr,
    runtimeInfo,
  };
}

const runtimeInfo: RuntimeInfo = {
  prettyLangName: "Python",
  version: String(pyodideLock.info.python),
};

function splitReplExamples(content: string): ReplCommand[] {
  const initCommands: { command: string; output: ReplOutput[] }[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith(">>> ")) {
      // Remove the prompt from the command
      initCommands.push({ command: line.slice(4), output: [] });
    } else if (line.startsWith("... ")) {
      if (initCommands.length > 0) {
        initCommands[initCommands.length - 1].command += "\n" + line.slice(4);
      }
    } else {
      // Lines without prompt are output from the previous command
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

function getCommandlineStr(filenames: string[]) {
  return `python ${filenames[0]}`;
}
