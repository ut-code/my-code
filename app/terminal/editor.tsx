"use client";

import dynamic from "next/dynamic";
// https://github.com/securingsincity/react-ace/issues/27 により普通のimportができない
const AceEditor = dynamic(
  async () => {
    const ace = await import("react-ace");
    // テーマは色分けが今のTerminal側のハイライト(highlight.js)の実装に近いものを適当に選んだ
    await import("ace-builds/src-min-noconflict/theme-tomorrow");
    await import("ace-builds/src-min-noconflict/theme-twilight");
    await import("ace-builds/src-min-noconflict/ext-language_tools");
    await import("ace-builds/src-min-noconflict/ext-searchbox");
    await import("ace-builds/src-min-noconflict/mode-python");
    await import("ace-builds/src-min-noconflict/mode-c_cpp");
    await import("ace-builds/src-min-noconflict/mode-json");
    await import("ace-builds/src-min-noconflict/mode-csv");
    await import("ace-builds/src-min-noconflict/mode-text");
    return ace;
  },
  { ssr: false }
);
import "./editor.css";
import { useFile } from "./file";
import { useEffect } from "react";
import { useSectionCode } from "../[docs_id]/section";
import clsx from "clsx";
import { useChangeTheme } from "../[docs_id]/themeToggle";
// snippetを有効化するにはsnippetもimportする必要がある: import "ace-builds/src-min-noconflict/snippets/python";

// mode-xxxx.js のファイル名と、AceEditorの mode プロパティの値が対応する
export type AceLang = "python" | "c_cpp" | "json" | "csv" | "text";

interface EditorProps {
  language?: AceLang;
  tabSize: number;
  filename: string;
  initContent: string;
  readonly?: boolean;
}
export function EditorComponent(props: EditorProps) {
  const theme = useChangeTheme();
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
      <div className="flex flex-row items-center">
        <div className="font-mono text-sm mt-2 mb-1 ml-4 mr-2">
          {props.filename}
          {props.readonly && <span className="font-sans ml-2">(編集不可)</span>}
        </div>
        <button
          className={clsx(
            "btn btn-xs btn-soft btn-warning mt-1 mb-1",
            // btn-warning は文字色を変えるがsvgの色は変えてくれないので、 stroke-warning を追加指定している
            "stroke-warning hover:stroke-warning-content active:stroke-warning-content",
            // codeの内容が変更された場合のみ表示する
            (props.readonly || code == props.initContent) && "invisible"
          )}
          onClick={() => writeFile(props.filename, props.initContent)}
        >
          {/*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/}
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Edit / Undo">
              <path
                id="Vector"
                d="M10 8H5V3M5.29102 16.3569C6.22284 17.7918 7.59014 18.8902 9.19218 19.4907C10.7942 20.0913 12.547 20.1624 14.1925 19.6937C15.8379 19.225 17.2893 18.2413 18.3344 16.8867C19.3795 15.5321 19.963 13.878 19.9989 12.1675C20.0347 10.4569 19.5211 8.78001 18.5337 7.38281C17.5462 5.98561 16.1366 4.942 14.5122 4.40479C12.8878 3.86757 11.1341 3.86499 9.5083 4.39795C7.88252 4.93091 6.47059 5.97095 5.47949 7.36556"
                // stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          元の内容に戻す
        </button>
      </div>
      <AceEditor
        name={`ace-editor-${props.filename}`}
        mode={props.language}
        theme={theme}
        tabSize={props.tabSize}
        width="100%"
        height={
          Math.max((props.initContent.split("\n").length + 2) * 14, 128) + "px"
        }
        className="font-mono!" // Aceのデフォルトフォントを上書き
        readOnly={props.readonly}
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
