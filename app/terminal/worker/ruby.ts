"use client";

import { createContext, useContext } from "react";
import { RuntimeContext } from "../runtime";
import { ReplCommand, ReplOutput } from "../repl";

export const RubyContext = createContext<RuntimeContext>(null!);

export function useRuby() {
  const context = useContext(RubyContext);
  if (!context) {
    throw new Error("useRuby must be used within a RubyProvider");
  }
  return {
    ...context,
    splitReplExamples,
    getCommandlineStr,
  };
}

function splitReplExamples(content: string): ReplCommand[] {
  const initCommands: { command: string; output: ReplOutput[] }[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith(">> ")) {
      // Ruby IRB uses >> as the prompt
      initCommands.push({ command: line.slice(3), output: [] });
    } else if (line.startsWith("?> ")) {
      // Ruby IRB uses ?> for continuation
      if (initCommands.length > 0) {
        initCommands[initCommands.length - 1].command += "\n" + line.slice(3);
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
  return `ruby ${filenames[0]}`;
}
