"use client";

import { AceLang } from "./editor";
import { MarkdownLang } from "@/[lang]/[pageId]/styledSyntaxHighlighter";
import { LangConstants } from "./interface";

export type RuntimeLang =
  | "python"
  | "ruby"
  | "cpp"
  | "rust"
  | "javascript"
  | "typescript";

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

