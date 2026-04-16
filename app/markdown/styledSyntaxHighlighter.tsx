"use client";

import { useChangeTheme } from "@/themeToggle";
import {
  tomorrow,
  tomorrowNight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { lazy, Suspense } from "react";
import { LangConstants } from "@my-code/runtime/languages";
import clsx from "clsx";
import { useIsClient } from "@/lib/clientOnly";

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
  className?: string;
  language: LangConstants;
}) {
  const theme = useChangeTheme();
  const codetheme = theme === "tomorrow" ? tomorrow : tomorrowNight;
  const isClient = useIsClient();
  return isClient ? (
    <Suspense
      fallback={
        <FallbackPre className={props.className}>{props.children}</FallbackPre>
      }
    >
      <SyntaxHighlighter
        language={props.language.rsh ?? "text"}
        PreTag="div"
        className={clsx(
          "border-2 border-current/20 mx-2 my-2 rounded-box p-4! bg-base-300! text-base-content!",
          props.className
        )}
        style={codetheme}
      >
        {props.children}
      </SyntaxHighlighter>
    </Suspense>
  ) : (
    <FallbackPre className={props.className}>{props.children}</FallbackPre>
  );
}
function FallbackPre({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <pre
      className={clsx(
        "border-2 border-current/20 mx-2 my-2 rounded-box p-4! bg-base-300! text-base-content!",
        "w-full overflow-auto",
        className
      )}
    >
      {children}
    </pre>
  );
}
