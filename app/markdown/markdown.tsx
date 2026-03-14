import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import removeComments from "remark-remove-comments";
import remarkCjkFriendly from "remark-cjk-friendly";
import {
  MultiHighlightTag,
  remarkMultiHighlight,
  ReplacedRange,
} from "./multiHighlight";
import { Heading } from "./heading";
import { AutoCodeBlock } from "./codeBlock";

export function StyledMarkdown(props: {
  content: string;
  replacedRange?: ReplacedRange[];
}) {
  return (
    <Markdown
      remarkPlugins={[
        remarkGfm,
        removeComments,
        remarkCjkFriendly,
        [remarkMultiHighlight, props.replacedRange],
      ]}
      components={components}
    >
      {props.content}
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
    <div className="w-max max-w-full overflow-x-auto mx-auto my-2 rounded-box border border-current/20 shadow-sm">
      <table className="table w-max" {...props} />
    </div>
  ),
  hr: ({ node, ...props }) => <hr className="border-accent my-4" {...props} />,
  pre: ({ node, ...props }) => props.children,
  code: AutoCodeBlock,
  ins: MultiHighlightTag,
};
