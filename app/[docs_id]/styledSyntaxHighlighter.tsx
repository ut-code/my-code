import { useChangeTheme } from "./themeToggle";
import {
  tomorrow,
  tomorrowNight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import dynamic from "next/dynamic";

// SyntaxHighlighterはファイルサイズがでかいので & HydrationErrorを起こすので、SSRを無効化する
const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"), {
  ssr: false,
});

// Markdownで指定される可能性のある言語名を列挙
export type MarkdownLang =
  | "python"
  | "py"
  | "ruby"
  | "rb"
  | "cpp"
  | "c++"
  | "javascript"
  | "js"
  | "typescript"
  | "ts"
  | "bash"
  | "sh"
  | "json"
  | "csv"
  | "text"
  | "txt";

// react-syntax-highliter (hljs版) が対応している言語
// https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD を参照
export type SyntaxHighlighterLang =
  | "python"
  | "ruby"
  | "c"
  | "cpp"
  | "javascript"
  | "typescript"
  | "bash"
  | "json";
export function getSyntaxHighlighterLang(
  lang: MarkdownLang | undefined
): SyntaxHighlighterLang | undefined {
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
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    case "bash":
    case "sh":
      return "bash";
    case "json":
      return "json";
    case "csv": // not supported
    case "text":
    case "txt":
    case undefined:
      return undefined;
    default:
      lang satisfies never;
      console.warn(`Language not listed in MarkdownLang: ${lang}`);
      return undefined;
  }
}
export function StyledSyntaxHighlighter(props: {
  children: string;
  language: SyntaxHighlighterLang | undefined;
}) {
  const theme = useChangeTheme();
  const codetheme = theme === "tomorrow" ? tomorrow : tomorrowNight;
  return (
    <SyntaxHighlighter
      language={props.language}
      PreTag="div"
      className="border-2 border-current/20 mx-2 my-2 rounded-box p-4! bg-base-300! text-base-content!"
      style={codetheme}
    >
      {props.children}
    </SyntaxHighlighter>
  );
}
