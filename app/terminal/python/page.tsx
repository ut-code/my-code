"use client";

import { TerminalComponent } from "../terminal";
import { usePyodide } from "./pyodide";

export default function PythonPage() {
  const { isPyodideReady, runPython } = usePyodide();
  return (
    <div className="p-4">
      <TerminalComponent
        ready={isPyodideReady}
        initMessage="Welcome to Pyodide Terminal!"
        prompt=">>> "
        sendCommand={runPython}
      />
    </div>
  );
}
