"use client";

import { ReplTerminal } from "../repl";

export function PythonEmbeddedTerminal({
  terminalId,
  content,
}: {
  terminalId: string;
  content: string;
}) {
  return (
    <ReplTerminal
      terminalId={terminalId}
      language="python"
      content={content}
    />
  );
}
