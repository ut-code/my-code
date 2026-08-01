import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import removeComments from "remark-remove-comments";
import remarkCjkFriendly from "remark-cjk-friendly";
import { MultiHighlightTag, remarkMultiHighlight } from "./multiHighlight";
import { Heading } from "./heading";
import { AutoCodeBlock } from "./codeBlock";
import { ReplacedRange } from "@/lib/docs";
import remarkTerm from "./remarkTerm";
import Term from "./term";
import remarkAlert from "./remarkGithubAlerts";
import clsx from "clsx";
import {
  DaisyErrorIcon,
  DaisyInfoIcon,
  DaisySuccessIcon,
  DaisyWarningIcon,
} from "@/daisyAlertIcon";
import { CSSProperties } from "react";
import { WithAutoTooltipPosition } from "./tooltipPosition";
import Link from "next/link";

export function StyledMarkdown(props: {
  content: string;
  replacedRange?: ReplacedRange[];
  interactive?: boolean;
}) {
  return (
    <Markdown
      remarkPlugins={[
        remarkGfm,
        removeComments,
        remarkCjkFriendly,
        [remarkMultiHighlight, props.replacedRange],
        remarkTerm,
        remarkAlert,
      ]}
      components={props.interactive ? interactiveComponents : baseComponents}
    >
      {props.content}
    </Markdown>
  );
}

// TailwindCSSがh1などのタグのスタイルを消してしまうので、手動でスタイルを指定する必要がある
// チャット回答、term定義内などではコードブロックの操作やtermリンクを無効化したbaseComponentを使用
const baseComponents: Components = {
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
  a: ({ node, href, ...props }) =>
    href?.startsWith("http") ? (
      <WithAutoTooltipPosition
        as="a"
        className="link link-info tooltip tooltip-info before:whitespace-pre"
        href={href}
        data-tip={`外部リンク\n${href}`}
        target="_blank"
        {...props}
      />
    ) : (
      // 内部リンクはaタグではなくtermで書いてほしいが、万が一書いてしまった場合Linkで表示する
      <Link className="link link-info" href={href ?? ""} {...props} />
    ),
  strong: ({ node, ...props }) => (
    <strong className="text-primary" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="w-max max-w-full overflow-x-auto mx-auto my-2 rounded-box border border-current/20 shadow-sm">
      <table className="table w-max" {...props} />
    </div>
  ),
  hr: () => null,
  blockquote: ({ node, className, children, ...props }) => (
    <blockquote
      className={clsx("alert", className, "mx-2 my-2", "flex")}
      {...props}
    >
      <div
        // <p>がmx-2 my-2を設定するので、その分広げて相殺
        className="flex-1 w-full -m-2"
      >
        {children}
      </div>
    </blockquote>
  ),
  aside: ({ node, className, children, ...props }) => (
    // remarkGitHubAlerts.ts でalertをasideタグにしている
    <aside
      className={clsx(
        "alert",
        className,
        className?.includes("alert-") && "alert-soft shadow-xs",
        "mx-2 my-2",
        "flex items-start"
      )}
      {...props}
    >
      {className?.includes("alert-info") ? (
        <DaisyInfoIcon />
      ) : className?.includes("alert-success") ? (
        <DaisySuccessIcon />
      ) : className?.includes("alert-warning") ? (
        <DaisyWarningIcon />
      ) : className?.includes("alert-error") ? (
        <DaisyErrorIcon />
      ) : null}
      <div
        // <p>がmx-2 my-2を設定するので、その分広げて相殺
        className="flex-1 w-full -m-2 self-center"
        // alertネスト対応
        style={{ "--alert-color": "initial" } as CSSProperties}
      >
        {children}
      </div>
    </aside>
  ),
  pre: ({ children }) => children,
  code: (props) => <AutoCodeBlock interactive={false} {...props} />,
  ins: ({ children }) => children,
  q: ({ children }) => children,
};
// ドキュメント本文で使うフルバージョン:
const interactiveComponents: Components = {
  ...baseComponents,
  code: (props) => <AutoCodeBlock interactive={true} {...props} />,
  ins: MultiHighlightTag,
  q: Term,
};
