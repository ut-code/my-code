"use client";

import { createContext, useContext } from "react";
import { RuntimeContext } from "../runtime";
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
    // getCommandlineStr,
  };
}

function splitReplExamples(content: string): ReplCommand[] {
  const initCommands: { command: string; output: ReplOutput[] }[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith("> ")) {
      // Remove the prompt from the command
      initCommands.push({ command: line.slice(2), output: [] });
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
