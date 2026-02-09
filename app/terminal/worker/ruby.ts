"use client";

import { createContext, useContext } from "react";
import { RuntimeContext, RuntimeInfo } from "../runtime";
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
    runtimeInfo,
  };
}

const runtimeInfo: RuntimeInfo = {
  prettyLangName: "Ruby",
  version: "3.4",
};

function splitReplExamples(content: string): ReplCommand[] {
  const initCommands: { command: string; output: ReplOutput[] }[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith("irb")) {
      if (
        initCommands.length > 0 &&
        initCommands[initCommands.length - 1].output.length === 0
      ) {
        // 前のコマンド行と連続している場合つなげる
        initCommands[initCommands.length - 1].command +=
          "\n" + line.slice(line.indexOf(" ") + 1);
      } else {
        initCommands.push({
          command: line.slice(line.indexOf(" ") + 1),
          output: [],
        });
      }
    } else if (line.startsWith("=> ")) {
      if (initCommands.length > 0) {
        initCommands[initCommands.length - 1].output.push({
          type: "return",
          message: line.slice(3),
        });
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
