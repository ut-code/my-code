import { EditorComponent } from "@/terminal/editor";
import { ExecFile } from "@/terminal/exec";
import { ReplTerminal } from "@/terminal/repl";
import { langConstants, MarkdownLang } from "@my-code/runtime/languages";
import { JSX, ReactNode } from "react";
import { ExtraProps } from "react-markdown";
import { StyledSyntaxHighlighter } from "./styledSyntaxHighlighter";

export function AutoCodeBlock({
  node,
  className,
  ref,
  style,
  ...props
}: JSX.IntrinsicElements["code"] & ExtraProps) {
  const match = /^language-(\w+)(-repl|-exec|-readonly)?\:?(.+)?$/.exec(
    className || ""
  );
  if (match) {
    const language = langConstants(match[1] as MarkdownLang | undefined);
    if (match[2] === "-exec" && match[3]) {
      /*
      ```python-exec:main.py
      hello, world!
      ```
      ↓
      ---------------------------
       [▶ 実行] `python main.py`
        hello, world!
      ---------------------------
      */
      if (language.runtime) {
        return (
          <ExecFile
            language={language}
            filenames={match[3].split(",")}
            content={String(props.children || "").replace(/\n$/, "")}
          />
        );
      }
    } else if (match[2] === "-repl") {
      // repl付きの言語指定
      if (!match[3]) {
        console.error(
          `${match[1]}-repl without terminal id! content: ${String(props.children).slice(0, 20)}...`
        );
      }
      if (language.runtime) {
        return (
          <ReplTerminal
            terminalId={match[3]}
            language={language}
            initContent={String(props.children || "").replace(/\n$/, "")}
          />
        );
      }
    } else if (match[3]) {
      // ファイル名指定がある場合、ファイルエディター
      return (
        <EditorComponent
          language={language}
          filename={match[3]}
          readonly={match[2] === "-readonly"}
          initContent={String(props.children || "").replace(/\n$/, "")}
        />
      );
    }
    return (
      <StyledSyntaxHighlighter language={language}>
        {String(props.children || "").replace(/\n$/, "")}
      </StyledSyntaxHighlighter>
    );
  } else if (String(props.children).includes("\n")) {
    // 言語指定なしコードブロック
    return (
      <StyledSyntaxHighlighter language={langConstants(undefined)}>
        {String(props.children || "").replace(/\n$/, "")}
      </StyledSyntaxHighlighter>
    );
  } else {
    // inline
    return <InlineCode>{props.children}</InlineCode>;
  }
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="bg-current/10 border border-current/20 px-1 py-0.5 mx-0.5 rounded-md">
      {children}
    </code>
  );
}
