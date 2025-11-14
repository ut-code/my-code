import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { EditorComponent, getAceLang } from "../terminal/editor";
import { ExecFile } from "../terminal/exec";
import { useChangeTheme } from "./themeToggle";
import {
  tomorrow,
  atomOneDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ReactNode } from "react";
import { getRuntimeLang } from "@/terminal/runtime";
import { ReplTerminal } from "@/terminal/repl";
import dynamic from "next/dynamic";
// SyntaxHighlighterはファイルサイズがでかいので & HydrationErrorを起こすので、SSRを無効化する
const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"), {
  ssr: false,
});

export function StyledMarkdown({ content }: { content: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </Markdown>
  );
}

// TailwindCSSがh1などのタグのスタイルを消してしまうので、手動でスタイルを指定する必要がある
const components: Components = {
  h1: ({ children }) => <Heading level={1}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,
  h5: ({ children }) => <Heading level={5}>{children}</Heading>,
  h6: ({ children }) => <Heading level={6}>{children}</Heading>,
  p: ({ node, ...props }) => <p className="mx-2 my-2" {...props} />,
  ul: ({ node, ...props }) => (
    <ul className="list-disc list-outside ml-6 my-2" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal list-outside ml-6 my-2" {...props} />
  ),
  li: ({ node, ...props }) => <li className="my-1" {...props} />,
  a: ({ node, ...props }) => <a className="link link-info" {...props} />,
  strong: ({ node, ...props }) => (
    <strong className="text-primary" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="w-max max-w-full overflow-x-auto mx-auto my-2 rounded-lg border border-base-content/5 shadow-sm">
      <table className="table w-max" {...props} />
    </div>
  ),
  hr: ({ node, ...props }) => <hr className="border-accent my-4" {...props} />,
  pre: ({ node, ...props }) => props.children,
  code: ({ node, className, ref, style, ...props }) => (
    <CodeComponent {...{ node, className, ref, style, ...props }} />
  ),
};

export function Heading({
  level,
  children,
}: {
  level: number;
  children: ReactNode;
}) {
  switch (level) {
    case 1:
      return <h1 className="text-2xl font-bold my-4">{children}</h1>;
    case 2:
      return <h2 className="text-xl font-bold mt-4 mb-3 ">{children}</h2>;
    case 3:
      return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
    case 4:
      return <h4 className="text-base font-bold mt-3 mb-2">{children}</h4>;
    case 5:
      // TODO: これ以下は4との差がない (全体的に大きくする必要がある？)
      return <h5 className="text-base font-bold mt-3 mb-2">{children}</h5>;
    case 6:
      return <h6 className="text-base font-bold mt-3 mb-2">{children}</h6>;
  }
}

function CodeComponent({
  node,
  className,
  ref,
  style,
  ...props
}: {
  node: unknown;
  className?: string;
  ref?: unknown;
  style?: unknown;
  [key: string]: unknown;
}) {
  const theme = useChangeTheme();
  const codetheme = theme === "tomorrow" ? tomorrow : atomOneDark;
  const match = /^language-(\w+)(-repl|-exec|-readonly)?\:?(.+)?$/.exec(
    className || ""
  );
  if (match) {
    const runtimeLang = getRuntimeLang(match[1]);
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
      if (runtimeLang) {
        return (
          <ExecFile
            language={runtimeLang}
            filenames={match[3].split(",")}
            content={String(props.children || "").replace(/\n$/, "")}
          />
        );
      }
    } else if (match[2] === "-repl") {
      // repl付きの言語指定
      if (!match[3]) {
        console.warn(
          `${match[1]}-repl without terminal id! content: ${String(props.children).slice(0, 20)}...`
        );
      }
      if (runtimeLang) {
        return (
          <ReplTerminal
            terminalId={match[3]}
            language={runtimeLang}
            initContent={String(props.children || "").replace(/\n$/, "")}
          />
        );
      }
    } else if (match[3]) {
      // ファイル名指定がある場合、ファイルエディター
      const aceLang = getAceLang(match[1]);
      return (
        <EditorComponent
          language={aceLang}
          filename={match[3]}
          readonly={match[2] === "-readonly"}
          initContent={String(props.children || "").replace(/\n$/, "")}
        />
      );
    }
    return (
      <SyntaxHighlighter
        language={match[1]}
        PreTag="div"
        className="border border-base-300 mx-2 my-2 rounded-lg p-4!"
        style={codetheme}
        {...props}
      >
        {String(props.children || "").replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  } else if (String(props.children).includes("\n")) {
    // 言語指定なしコードブロック
    return (
      <SyntaxHighlighter
        PreTag="div"
        className="border border-base-300 mx-2 my-2 rounded-lg p-4!"
        style={codetheme}
        {...props}
      >
        {String(props.children || "").replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  } else {
    // inline
    return (
      <code
        className="bg-base-content/10 border border-base-content/20 px-1 py-0.5 mx-0.5 rounded-md"
        {...props}
      />
    );
  }
}
