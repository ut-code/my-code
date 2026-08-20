import main_py from "./samples/main.py?raw";
import main_rb from "./samples/main.rb?raw";
import main_js from "./samples/main.js?raw";
import main2_ts from "./samples/main2.ts?raw";
import main_cpp from "./samples/main.cpp?raw";
import sub_h from "./samples/sub.h?raw";
import sub_cpp from "./samples/sub.cpp?raw";
import main2_rs from "./samples/main2.rs?raw";
import sub_rs from "./samples/sub.rs?raw";

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
        // REPLが実装されている言語の場合
        repl: true;
        // ReplOutput[] ではない。stringのパースはruntimeが行う
        sampleReplInit: string;
        // terminal/highlight.ts でインポートするprismの言語定義と対応
        prism: "python" | "ruby" | "javascript";
        prompt: string;
        promptMore: string;
        returnPrefix?: string;
      }
    | {
        repl?: false;
        sampleReplInit?: undefined;
        prism?: undefined;
        prompt?: undefined;
        promptMore?: undefined;
        returnPrefix?: undefined;
      }
  ) &
  (
    | {
        runtime: RuntimeLang;
        // Sandboxにデフォルトで用意するファイル
        sampleFiles: Record<string, string>;
        // C++のように実行時に全ソースファイルを指定する必要がある言語は、
        // 現在のファイルリストを受け取って実行すべきファイルを返す関数を定義する
        sampleExec: (files: string[]) => string[];
        // Sandboxの実行ボタンの下に読み取り専用で表示されるファイル
        readonlyFiles?: string[];
        supportsMultiFile: boolean;
        supportsFileOutput: boolean;
      }
    | {
        runtime?: undefined;
        sampleFiles?: undefined;
        sampleExec?: undefined;
        readonlyFiles?: undefined;
        supportsMultiFile?: undefined;
        supportsFileOutput?: undefined;
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
        repl: true,
        sampleReplInit: '>>> print("Hello, World!")\nHello, World!',
        prompt: ">>> ",
        promptMore: "... ",
        sampleFiles: {
          "main.py": main_py,
        },
        sampleExec: () => ["main.py"],
        supportsMultiFile: true,
        supportsFileOutput: true,
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
        repl: true,
        sampleReplInit: 'irb(main):001:0> puts "Hello, World!"\nHello, World!',
        // TODO: 実際のirbのプロンプトは静的でなく、(main)や番号などの動的な表示がある
        prompt: "irb> ",
        promptMore: "irb* ",
        returnPrefix: "=> ",
        sampleFiles: {
          "main.rb": main_rb,
        },
        sampleExec: () => ["main.rb"],
        supportsMultiFile: true,
        supportsFileOutput: true,
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
        repl: true,
        sampleReplInit: '> console.log("Hello, World!");\nHello, World!',
        prompt: "> ",
        promptMore: "... ",
        sampleFiles: {
          "main.js": main_js,
        },
        sampleExec: () => ["main.js"],
        supportsMultiFile: false,
        supportsFileOutput: false,
      };
    case "typescript":
    case "ts":
      return {
        originalLang: lang,
        rsh: "typescript",
        ace: "typescript",
        tabSize: 2,
        runtime: "typescript",
        repl: false,
        sampleFiles: {
          // main.tsにすると出力ファイルがjavascriptのサンプルと被る
          "main2.ts": main2_ts,
        },
        sampleExec: () => ["main2.ts"],
        readonlyFiles: ["main2.js"],
        supportsMultiFile: false,
        supportsFileOutput: false,
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
        repl: false,
        sampleFiles: {
          "main.cpp": main_cpp,
          "sub.h": sub_h,
          "sub.cpp": sub_cpp,
        },
        sampleExec: (files: string[]) =>
          files.filter((f) =>
            ["c", "cpp", "cc", "cxx"].includes(f.split(".").at(-1) ?? "")
          ),
        supportsMultiFile: true,
        supportsFileOutput: false,
      };
    case "rust":
    case "rs":
      return {
        originalLang: lang,
        rsh: "rust",
        ace: "rust",
        tabSize: 4,
        runtime: "rust",
        repl: false,
        sampleFiles: {
          "main2.rs": main2_rs,
          "sub.rs": sub_rs,
        },
        sampleExec: () => ["main2.rs"],
        supportsMultiFile: true,
        supportsFileOutput: false,
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
        // throw new Error(`LangConstants not defined for language: ${lang}`);
        console.error(`LangConstants not defined for language: ${lang}`);
      }
      return { originalLang: lang };
  }
}
