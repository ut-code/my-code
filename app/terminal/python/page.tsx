"use client";

import { EditorComponent } from "../editor";
import { ExecFile } from "../exec";
import { ReplTerminal } from "../repl";

export default function PythonPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <ReplTerminal
        terminalId=""
        language="python"
        initContent={">>> print('hello, world!')\nhello, world!"}
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
