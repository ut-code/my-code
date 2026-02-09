"use client";

import { createContext, useContext } from "react";
import { RuntimeContext, RuntimeInfo } from "../runtime";
import { ReplCommand, ReplOutput } from "../repl";

export const JSEvalContext = createContext<RuntimeContext>(null!);

export function useJSEval() {
  const context = useContext(JSEvalContext);
  if (!context) {
    throw new Error("useJSEval must be used within a JSEvalProvider");
  }
  return {
    ...context,
    splitReplExamples,
    getCommandlineStr,
    runtimeInfo,
  };
}

const runtimeInfo: RuntimeInfo = {
  prettyLangName: "JavaScript",
};

function splitReplExamples(content: string): ReplCommand[] {
  const initCommands: { command: string; output: ReplOutput[] }[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith("> ")) {
      // Remove the prompt from the command
      initCommands.push({ command: line.slice(2), output: [] });
    } else if (line.startsWith("... ")) {
      if (initCommands.length > 0) {
        initCommands[initCommands.length - 1].command += "\n" + line.slice(4);
      }
    } else {
      // Lines without prompt are output from the previous command
      // and the last output is return value
      if (initCommands.length > 0) {
        initCommands[initCommands.length - 1].output.forEach(
          (out) => (out.type = "stdout")
        );
        initCommands[initCommands.length - 1].output.push({
          type: "return",
          message: line,
        });
      }
    }
  }
  return initCommands;
}

function getCommandlineStr(filenames: string[]) {
  return `node ${filenames[0]}`;
}
