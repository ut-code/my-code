"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useChangeTheme } from "@/themeToggle";
import { useEmbedContext } from "./embedContext";
import { LangConstants } from "@my-code/runtime/languages";
import { MinMaxButton, Modal } from "./modal";

// https://github.com/securingsincity/react-ace/issues/27 により普通のimportができない
const AceEditor = lazy(async () => {
  if (typeof window !== "undefined") {
    const ace = await import("react-ace");
    // snippetを有効化するにはsnippetもimportする必要がある: import "ace-builds/src-min-noconflict/snippets/python";
    // テーマは色分けが今のTerminal側のハイライト(highlight.js)の実装に近いものを適当に選んだ
    await import("ace-builds/src-min-noconflict/theme-tomorrow");
    await import("ace-builds/src-min-noconflict/theme-tomorrow_night");
    await import("ace-builds/src-min-noconflict/ext-language_tools");
    await import("ace-builds/src-min-noconflict/ext-searchbox");
    await import("ace-builds/src-min-noconflict/mode-python");
    await import("ace-builds/src-min-noconflict/mode-ruby");
    await import("ace-builds/src-min-noconflict/mode-c_cpp");
    await import("ace-builds/src-min-noconflict/mode-rust");
    await import("ace-builds/src-min-noconflict/mode-javascript");
    await import("ace-builds/src-min-noconflict/mode-typescript");
    await import("ace-builds/src-min-noconflict/mode-json");
    await import("ace-builds/src-min-noconflict/mode-csv");
    await import("ace-builds/src-min-noconflict/mode-text");
    await import("ace-builds/src-min-noconflict/mode-dart");
    return ace;
  } else {
    throw new Error("should not try SSR");
  }
});

interface EditorProps {
  language: LangConstants;
  filename: string;
  initContent: string;
  readonly?: boolean;
  onDelete?: () => void;
}
export function EditorComponent(props: EditorProps) {
  const theme = useChangeTheme();
  const { files, writeFile, diagnostics } = useEmbedContext();
  const fileDiagnostics = useMemo(
    () =>
      Object.values(diagnostics)
        .flat()
        .filter((diag) =>
          diag.frames.some((f) => f.filename === props.filename)
        ),
    [diagnostics, props.filename]
  );

  const annotations = useMemo(() => {
    return fileDiagnostics.flatMap((diag) =>
      diag.frames
        .slice(0, 1)
        .filter((f) => f.filename === props.filename)
        .map((f) => ({
          row: Math.max(0, f.startLineNumber - 1),
          column: Math.max(0, (f.startColumn ?? 1) - 1),
          text: diag.message,
          type: diag.severity ?? "error", // "error" | "warning" | "info"
        }))
    );
  }, [fileDiagnostics, props.filename]);

  const markers = useMemo(() => {
    return fileDiagnostics.flatMap((diag) =>
      diag.frames
        .map((f, i) => ({ ...f, isFirstFrame: i === 0 }))
        .filter((f) => f.filename === props.filename)
        .map((f) => {
          const startRow = Math.max(0, f.startLineNumber - 1);
          const endRow = f.endLineNumber
            ? Math.max(startRow, f.endLineNumber - 1)
            : startRow;
          const startCol =
            f.startColumn !== undefined ? Math.max(0, f.startColumn - 1) : 0;
          const endCol =
            f.endColumn !== undefined
              ? Math.max(startCol + 1, f.endColumn - 1)
              : Number.MAX_SAFE_INTEGER;

          const isError = (diag.severity ?? "error") === "error";
          const isWarning = diag.severity === "warning";
          const className = clsx(
            "absolute rounded-b-none! border-dashed border-b-1",
            isError
              ? "border-error"
              : isWarning
                ? "border-warning"
                : "border-accent",
            f.isFirstFrame &&
              (isError
                ? "bg-error/20"
                : isWarning
                  ? "bg-warning/20"
                  : "bg-accent/20")
          );

          return {
            startRow,
            startCol,
            endRow,
            endCol,
            className,
            type:
              f.startColumn !== undefined &&
              f.endColumn !== undefined &&
              startRow === endRow
                ? ("text" as const)
                : ("fullLine" as const),
            inFront: false,
          };
        })
    );
  }, [fileDiagnostics, props.filename]);

  const code = files[props.filename] || props.initContent;
  useEffect(() => {
    if (!files[props.filename] && props.initContent) {
      writeFile({ [props.filename]: props.initContent });
    }
  }, [files, props.filename, props.initContent, writeFile]);

  const [fontSize, setFontSize] = useState<number>();
  const [windowHeight, setWindowHeight] = useState<number>(1000);
  const [initAce, setInitAce] = useState(false);
  useEffect(() => {
    const update = () => {
      setFontSize(
        parseFloat(getComputedStyle(document.documentElement).fontSize)
      ); // 1rem
      setWindowHeight(window.innerHeight);
      setInitAce(true);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // 現在の内容の行数、最小8行、最大50vh
  const editorHeight = Math.max(
    Math.min(
      code.split("\n").length + 1,
      Math.floor((windowHeight * 0.5) / ((fontSize || 16) + 1))
    ),
    8
  );

  const [isModal, setIsModal] = useState(false);

  if (
    process.env.NODE_ENV === "development" &&
    props.language.ace === undefined
  ) {
    throw new Error(
      `language ${props.language.originalLang} does not have ace mode defined!`
    );
  }

  return (
    <Modal
      id={`edit-${props.filename}`}
      className={clsx("flex flex-col", "text-base-content")}
      open={isModal}
      setOpen={setIsModal}
    >
      <div className="flex flex-row items-center bg-base-200 rounded-t-box">
        <span className="mt-2 mb-1 ml-3 mr-2 text-sm text-left">
          <span>
            {props.readonly
              ? "出力されたファイル(編集不可):"
              : "ファイルを編集:"}
          </span>
          <span className="font-mono ml-2">{props.filename}</span>
        </span>
        <button
          className={clsx(
            "btn btn-sm btn-soft btn-warning my-1",
            // codeの内容が変更された場合のみ表示する
            (props.readonly || code == props.initContent) && "invisible"
          )}
          onClick={() => writeFile({ [props.filename]: props.initContent })}
        >
          {/*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/}
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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
          <span className="hidden md:inline">元の内容に戻す</span>
        </button>
        <div className="flex-1" />
        {props.onDelete && (
          <button
            className="btn btn-sm btn-soft btn-error my-1 mr-1"
            onClick={props.onDelete}
            title="ファイルを削除"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 11V17"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11V17"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 7H20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden md:inline">削除</span>
          </button>
        )}
        <MinMaxButton open={isModal} id={`edit-${props.filename}`} />
      </div>
      {fontSize !== undefined && initAce ? (
        <Suspense
          fallback={
            <FallbackPre
              className="grow-1 rounded-b-box"
              editorHeight={editorHeight}
            >
              {code}
            </FallbackPre>
          }
        >
          <AceEditor
            name={`ace-editor-${props.filename}`}
            mode={props.language.ace ?? "text"}
            theme={theme}
            tabSize={props.language.tabSize ?? 4}
            width="100%"
            height={isModal ? "100%" : editorHeight * (fontSize + 1) + "px"}
            className="font-mono! rounded-b-box" // Aceのデフォルトフォントを上書き
            readOnly={props.readonly}
            fontSize={fontSize}
            showPrintMargin={false}
            enableBasicAutocompletion={false}
            enableLiveAutocompletion={false}
            enableSnippets={false}
            value={code}
            onChange={(code: string) => writeFile({ [props.filename]: code })}
            setOptions={{ useWorker: false }}
            annotations={annotations}
            markers={markers}
          />
        </Suspense>
      ) : (
        <FallbackPre
          className="grow-1 rounded-b-box"
          isModal={isModal}
          editorHeight={editorHeight}
        >
          {code}
        </FallbackPre>
      )}
    </Modal>
  );
}

function FallbackPre({
  children,
  editorHeight,
  isModal,
  className,
}: {
  children: string;
  editorHeight: number;
  isModal?: boolean;
  className?: string;
}) {
  // AceEditorはなぜかline-heightが小さい
  // fontSize + 1px になるっぽい?
  return (
    <pre
      className={clsx(
        "font-mono overflow-auto bg-base-300 pl-4 py-0 cursor-wait",
        className
      )}
      style={{
        height: isModal ? "100%" : `calc((1em + 1px) * ${editorHeight})`,
        lineHeight: "calc(1em + 1px)",
      }}
    >
      {children}
    </pre>
  );
}
