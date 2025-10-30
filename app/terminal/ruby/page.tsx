"use client";

import { EditorComponent } from "../editor";
import { ExecFile } from "../exec";
import { ReplTerminal } from "../repl";

export default function RubyPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <ReplTerminal
        terminalId=""
        language="ruby"
        initContent={">> puts 'hello, world!'\nhello, world!"}
      />
      <EditorComponent
        language="ruby"
        filename="main.rb"
        initContent="puts 'hello, world!'"
      />
      <ExecFile filenames={["main.rb"]} language="ruby" content="" />
    </div>
  );
}
