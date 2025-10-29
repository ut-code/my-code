"use client";

import { EditorComponent } from "../editor";
import { ExecFile } from "../exec";
import { ReplTerminal } from "../repl";
import { usePyodide } from "./pyodide";

export default function PythonPage() {
  const { init, ready, initializing, runPython, checkSyntax, mutex, interrupt } =
    usePyodide();
  return (
    <div className="p-4 flex flex-col gap-4">
      <ReplTerminal
        terminalId=""
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
        interrupt={interrupt}
      />
      <EditorComponent
        language="python"
        tabSize={4}
        filename="main.py"
        initContent="print('hello, world!')"
      />
      <ExecFile filenames={["main.py"]} language="python" content="" />
    </div>
  );
}
