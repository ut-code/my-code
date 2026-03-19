"use client";

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

export type LangConstants = {
  originalLang: MarkdownLang | undefined;
  // react-syntax-highliter (hljs版) が対応している言語
  // https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD を参照
  rsh?:
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
} & (
  | {
      // terminal/editor.tsx でimportする mode-xxxx.js のファイル名と、AceEditorの mode プロパティの値と対応する
      ace:
        | "python"
        | "ruby"
        | "c_cpp"
        | "rust"
        | "javascript"
        | "typescript"
        | "json"
        | "csv"
        | "text";
      tabSize: number;
    }
  | {
      ace?: undefined;
      tabSize?: undefined; // default: 4
    }
) &
  (
    | {
        runtime: RuntimeLang;
        // REPLが実装されている言語の場合
        // terminal/highlight.ts でインポートするprismの言語定義と対応
        prism: "python" | "ruby" | "javascript";
        prompt: string;
        promptMore: string;
        returnPrefix?: string;
      }
    | {
        runtime?: RuntimeLang;
        prism?: undefined;
        prompt?: undefined;
        promptMore?: undefined;
        returnPrefix?: undefined;
      }
  );

export function langConstants(lang: MarkdownLang | undefined): LangConstants {
  switch (lang) {
    case "python":
    case "py":
      return {
        originalLang: lang,
        rsh: "python",
        ace: "python",
        tabSize: 4,
        runtime: "python",
        prism: "python",
        prompt: ">>> ",
        promptMore: "... ",
      };
    case "ruby":
    case "rb":
      return {
        originalLang: lang,
        rsh: "ruby",
        ace: "ruby",
        tabSize: 2,
        runtime: "ruby",
        prism: "ruby",
        // TODO: 実際のirbのプロンプトは静的でなく、(main)や番号などの動的な表示がある
        prompt: "irb> ",
        promptMore: "irb* ",
        returnPrefix: "=> ",
      };
    case "javascript":
    case "js":
      return {
        originalLang: lang,
        rsh: "javascript",
        ace: "javascript",
        tabSize: 2,
        runtime: "javascript",
        prism: "javascript",
        prompt: "> ",
        promptMore: "... ",
      };
    case "typescript":
    case "ts":
      return {
        originalLang: lang,
        rsh: "typescript",
        ace: "typescript",
        tabSize: 2,
        runtime: "typescript",
      };
    case "cpp":
    case "c++":
      return {
        originalLang: lang,
        rsh: "cpp",
        ace: "c_cpp",
        // 2文字派と4文字派があるが、geminiが4文字で出力するので4でいいや
        tabSize: 4,
        runtime: "cpp",
      };
    case "rust":
    case "rs":
      return {
        originalLang: lang,
        rsh: "rust",
        ace: "rust",
        tabSize: 4,
        runtime: "rust",
      };
    case "bash":
    case "sh":
      return { originalLang: lang, rsh: "bash" };
    case "powershell":
      return { originalLang: lang, rsh: "powershell" };
    case "json":
      return {
        originalLang: lang,
        rsh: "json",
        // python-7章で使っている
        ace: "json",
        tabSize: 4,
      };
    case "toml":
      return { originalLang: lang, rsh: "ini" };
    case "html":
      return { originalLang: lang, rsh: "html" };
    case "makefile":
      return { originalLang: lang, rsh: "makefile" };
    case "cmake":
      return { originalLang: lang, rsh: "cmake" };
    case "csv":
      return {
        originalLang: lang,
        ace: "csv",
        // tabは使わないが、0は指定できないようなので適当にデフォルト値
        tabSize: 4,
      };
    case "text":
    case "txt":
    case undefined:
      return { originalLang: lang };
    default:
      lang satisfies never;
      if (process.env.NODE_ENV === "development") {
        throw new Error(`LangConstants not defined for language: ${lang}`);
      }
      return { originalLang: lang };
  }
}
