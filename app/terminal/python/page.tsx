"use client";

import { TerminalComponent } from "../terminal";
import { usePyodide } from "./pyodide";

export default function PythonPage() {
  const { init, ready, initializing, runPython, checkSyntax, mutex } = usePyodide();
  return (
    <div className="p-4">
      <TerminalComponent
        initRuntime={init}
        runtimeInitializing={initializing}
        runtimeReady={ready}
        initMessage="Welcome to Pyodide Terminal!"
        prompt=">>> "
        promptMore="... "
        language="python"
        tabSize={4}
        mutex={mutex}
        sendCommand={runPython}
        checkSyntax={checkSyntax}
      />
    </div>
  );
}
