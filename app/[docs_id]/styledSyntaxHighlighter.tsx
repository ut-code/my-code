"use client";

import { useChangeTheme } from "./themeToggle";
import {
  tomorrow,
  tomorrowNight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { lazy, Suspense, useEffect, useState } from "react";

// SyntaxHighlighterはファイルサイズがでかいので & HydrationErrorを起こすので、SSRを無効化する
const SyntaxHighlighter = lazy(() => {
  if (typeof window !== "undefined") {
    return import("react-syntax-highlighter");
  } else {
    throw new Error("should not try SSR");
  }
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
  | "html"
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
  | "html"
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
    case "html":
      return "html";
    case "csv": // not supported
    case "text":
    case "txt":
    case undefined:
      return undefined;
    default:
      lang satisfies never;
      console.error(`getSyntaxHighlighterLang() does not handle language ${lang}`);
      return undefined;
  }
}
export function StyledSyntaxHighlighter(props: {
  children: string;
  language: SyntaxHighlighterLang | undefined;
}) {
  const theme = useChangeTheme();
  const codetheme = theme === "tomorrow" ? tomorrow : tomorrowNight;
  const [initHighlighter, setInitHighlighter] = useState(false);
  useEffect(() => {
    setInitHighlighter(true);
  }, []);
  return initHighlighter ? (
    <Suspense fallback={<FallbackPre>{props.children}</FallbackPre>}>
      <SyntaxHighlighter
        language={props.language}
        PreTag="div"
        className="border-2 border-current/20 mx-2 my-2 rounded-box p-4! bg-base-300! text-base-content!"
        style={codetheme}
      >
        {props.children}
      </SyntaxHighlighter>
    </Suspense>
  ) : (
    <FallbackPre>{props.children}</FallbackPre>
  );
}
function FallbackPre({ children }: { children: string }) {
  return (
    <pre className="border-2 border-current/20 mx-2 my-2 rounded-box p-4! bg-base-300! text-base-content!">
      {children}
    </pre>
  );
}
