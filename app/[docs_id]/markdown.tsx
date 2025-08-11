import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { PythonEmbeddedTerminal } from "../terminal/python/embedded";
import { Heading } from "./section";

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
  code: ({ node, className, ref, style, ...props }) => {
    const match = /^language-(\w+)(-repl)?\:?(.+)?$/.exec(className || "");
    if (match) {
      if (match[2]) {
        // repl付きの言語指定
        // 現状はPythonのみ対応
        switch (match[1]) {
          case "python":
            return (
              <PythonEmbeddedTerminal
                content={String(props.children).replace(/\n$/, "")}
              />
            );
          default:
            console.warn(`Unsupported language for repl: ${match[1]}`);
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
      } else {
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
