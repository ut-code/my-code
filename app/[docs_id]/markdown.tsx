import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { PythonEmbeddedTerminal } from "../terminal/python/embedded";

export function StyledMarkdown({ content }: { content: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </Markdown>
  );
}

// TailwindCSSがh1などのタグのスタイルを消してしまうので、手動でスタイルを指定する必要がある
const components: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-2xl font-bold my-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-xl font-bold mt-4 mb-3 " {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className="text-base font-bold mt-3 mb-2" {...props} />
  ),
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
  code: ({ node, className, ref, style, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
      switch (match[1]) {
        case "python":
          return <PythonEmbeddedTerminal content={String(props.children).replace(/\n$/, "")} />;
        default:
          return (
            <SyntaxHighlighter
              language={match[1]}
              PreTag="div"
              className="px-4! py-4! m-0! font-mono!"
              // style={todo dark theme?}
              {...props}
            >
              {String(props.children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
      }
    } else if (String(props.children).includes("\n")) {
      // 言語指定なしコードブロック
      return (
        <SyntaxHighlighter
          PreTag="div"
          className="px-4! py-4! m-0! font-mono!"
          // style={todo dark theme?}
          {...props}
        >
          {String(props.children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    } else {
      // inline
      return (
        <code
          className="bg-base-200 border border-base-300 px-1 py-0.5 rounded text-sm "
          {...props}
        />
      );
    }
  },
  pre: ({ node, ...props }) => (
    <pre
      className="bg-base-200 border border-primary mx-2 my-2 rounded-lg text-sm overflow-x-auto"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => <hr className="border-primary my-4" {...props} />,
};
