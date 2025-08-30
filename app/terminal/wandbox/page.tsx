"use client";

import { EditorComponent } from "../editor";
import { ExecFile } from "../exec";

export default function WandboxPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <EditorComponent
        language="c_cpp"
        tabSize={4}
        filename="main.cpp"
        initContent=""
      />
      <EditorComponent
        language="c_cpp"
        tabSize={4}
        filename="sub.h"
        initContent=""
      />
      <EditorComponent
        language="c_cpp"
        tabSize={4}
        filename="sub.cpp"
        initContent=""
      />
      <ExecFile
        filenames={["main.cpp", "sub.cpp", "sub.h"]}
        language="cpp"
        content=""
      />
    </div>
  );
}
