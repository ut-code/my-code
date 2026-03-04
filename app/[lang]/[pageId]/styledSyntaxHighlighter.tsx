"use client";

import { useChangeTheme } from "@/themeToggle";
import {
  tomorrow,
  tomorrowNight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { lazy, Suspense, useEffect, useState } from "react";
import { LangConstants } from "@my-code/runtime/languages";
import clsx from "clsx";

// SyntaxHighlighterはファイルサイズがでかいので & HydrationErrorを起こすので、SSRを無効化する
const SyntaxHighlighter = lazy(() => {
  if (typeof window !== "undefined") {
    return import("react-syntax-highlighter");
  } else {
    throw new Error("should not try SSR");
  }
});

export function StyledSyntaxHighlighter(props: {
  children: string;
  language: LangConstants;
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
        language={props.language.rsh}
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
    <pre
      className={clsx(
        "border-2 border-current/20 mx-2 my-2 rounded-box p-4! bg-base-300! text-base-content!",
        "w-full overflow-auto"
      )}
    >
      {children}
    </pre>
  );
}
