"use client";

import { LangConstants } from "./interface";

// Markdownで指定される可能性のある言語名を列挙
export type MarkdownLang =
  | "python"
  | "py"
  | "ruby"
  | "rb"
  | "cpp"
  | "c++"
  | "rust"
  | "rs"
  | "javascript"
  | "js"
  | "typescript"
  | "ts"
  | "bash"
  | "sh"
  | "powershell"
  | "json"
  | "toml"
  | "csv"
  | "html"
  | "makefile"
  | "cmake"
  | "text"
  | "txt";

export type RuntimeLang =
  | "python"
  | "ruby"
  | "cpp"
  | "rust"
  | "javascript"
  | "typescript";

// react-syntax-highliter (hljs版) が対応している言語
// https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD を参照
export type SyntaxHighlighterLang =
  | "python"
  | "ruby"
  | "c"
  | "cpp"
  | "rust"
  | "javascript"
  | "typescript"
  | "bash"
  | "powershell"
  | "html"
  | "json"
  | "ini"
  | "makefile"
  | "cmake";

// terminal/editor.tsx でimportする mode-xxxx.js のファイル名と、AceEditorの mode プロパティの値と対応する
export type AceLang =
  | "python"
  | "ruby"
  | "c_cpp"
  | "rust"
  | "javascript"
  | "typescript"
  | "json"
  | "csv"
  | "text";

export function getRuntimeLang(
  lang: MarkdownLang | undefined
): RuntimeLang | undefined {
  // markdownで指定される可能性のある言語名からRuntimeLangを取得
  switch (lang) {
    case "python":
    case "py":
      return "python";
    case "ruby":
    case "rb":
      return "ruby";
    case "cpp":
    case "c++":
      return "cpp";
    case "rust":
    case "rs":
      return "rust";
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    case "bash":
    case "sh":
    case "powershell":
    case "json":
    case "toml":
    case "csv":
    case "text":
    case "txt":
    case "html":
    case "makefile":
    case "cmake":
    case undefined:
      // unsupported languages
      return undefined;
    default:
      lang satisfies never;
      console.error(`getRuntimeLang() does not handle language ${lang}`);
      return undefined;
  }
}

export function getAceLang(lang: MarkdownLang | undefined): AceLang {
  // Markdownで指定される可能性のある言語名からAceLangを取得
  switch (lang) {
    case "python":
    case "py":
      return "python";
    case "ruby":
    case "rb":
      return "ruby";
    case "cpp":
    case "c++":
      return "c_cpp";
    case "rust":
    case "rs":
      return "rust";
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    case "json":
      return "json";
    case "csv":
      return "csv";
    case "sh":
    case "bash":
    case "powershell":
    case "text":
    case "txt":
    case "html":
    case "toml":
    case "makefile":
    case "cmake":
    case undefined:
      console.warn(`Ace editor mode not implemented for language: ${lang}`);
      return "text";
    default:
      lang satisfies never;
      console.error(`getAceLang() does not handle language ${lang}`);
      return "text";
  }
}

export function langConstants(lang: RuntimeLang | AceLang): LangConstants {
  switch (lang) {
    case "python":
      return {
        tabSize: 4,
        prompt: ">>> ",
        promptMore: "... ",
      };
    case "ruby":
      return {
        tabSize: 2,
        // TODO: 実際のirbのプロンプトは静的でなく、(main)や番号などの動的な表示がある
        prompt: "irb> ",
        promptMore: "irb* ",
        returnPrefix: "=> ",
      };
    case "javascript":
    case "typescript":
      return {
        tabSize: 2,
        prompt: "> ",
        promptMore: "... ",
      };
    case "c_cpp":
    case "cpp":
      return {
        // 2文字派と4文字派があるが、geminiが4文字で出力するので4でいいや
        tabSize: 4,
      };
    case "rust":
      return {
        tabSize: 4,
      };
    case "json":
      return {
        // python-7章で使っている
        tabSize: 4,
      };
    case "csv":
    case "text":
      return {
        // tabは使わないが、0は指定できないようなので適当にデフォルト値
        tabSize: 4,
      };
    default:
      lang satisfies never;
      throw new Error(`LangConstants not defined for language: ${lang}`);
  }
}

