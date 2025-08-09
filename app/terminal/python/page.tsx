"use client";

import { TerminalComponent } from "../terminal";
import { usePyodide } from "./pyodide";

export default function PythonPage() {
  const { isPyodideReady, runPython, checkSyntax } = usePyodide();
  return (
    <div className="p-4">
      <TerminalComponent
        ready={isPyodideReady}
        initMessage="Welcome to Pyodide Terminal!"
        prompt=">>> "
        promptMore="... "
        sendCommand={runPython}
        checkSyntax={checkSyntax}
      />
    </div>
  );
}
