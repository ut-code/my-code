"use client";

import { useFile } from "./file";
import AceEditor from "react-ace";
import "./editor.css";
// テーマは色分けが今のTerminal側のハイライト(highlight.js)の実装に近いものを適当に選んだ
import "ace-builds/src-min-noconflict/theme-tomorrow";
import "ace-builds/src-min-noconflict/theme-twilight";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/mode-python";
import { useEffect } from "react";
import { useSectionCode } from "../[docs_id]/section";
// snippetを有効化するにはsnippetもimportする必要がある: import "ace-builds/src-min-noconflict/snippets/python";

interface EditorProps {
  language?: string;
  tabSize: number;
  filename: string;
  initContent: string;
}
export function EditorComponent(props: EditorProps) {
  const { files, writeFile } = useFile();
  const code = files[props.filename] || props.initContent;
  const sectionContext = useSectionCode();
  const addSectionFile = sectionContext?.addFile;
  useEffect(() => {
    if (!files[props.filename]) {
      writeFile(props.filename, props.initContent);
    }
    addSectionFile?.(props.filename);
  }, [files, props.filename, props.initContent, writeFile, addSectionFile]);

  return (
    <div className="embedded-editor">
      <div className="font-mono text-sm mt-2 mb-1 ml-4 ">{props.filename}</div>
      <AceEditor
        name={`ace-editor-${props.filename}`}
        mode={props.language}
        theme="tomorrow" // TODO dark theme
        tabSize={props.tabSize}
        width="100%"
        height={
          Math.max((props.initContent.split("\n").length + 2) * 14, 128) + "px"
        }
        className="font-mono!" // Aceのデフォルトフォントを上書き
        fontSize={14}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        enableSnippets={false}
        value={code}
        onChange={(code: string) => writeFile(props.filename, code)}
      />
    </div>
  );
}
