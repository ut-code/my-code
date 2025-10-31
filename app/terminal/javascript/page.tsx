"use client";

import { EditorComponent } from "../editor";
import { ReplTerminal } from "../repl";

export default function JavaScriptPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <ReplTerminal
        terminalId=""
        language="javascript"
        initContent={"> console.log('hello, world!')\nhello, world!"}
      />
      <EditorComponent
        language="javascript"
        filename="main.js"
        initContent="console.log('hello, world!');"
      />
    </div>
  );
}
