import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { PythonEmbeddedTerminal } from "../terminal/python/embedded";
import { Heading } from "./section";
import { type AceLang, EditorComponent } from "../terminal/editor";
import { ExecFile, ExecLang } from "../terminal/exec";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";

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
  hr: ({ node, ...props }) => <hr className="border-primary my-4" {...props} />,
  pre: ({ node, ...props }) => props.children,
  code: ({ node, className, ref, style, ...props }) => {
    const match = /^language-(\w+)(-repl|-exec|-readonly)?\:?(.+)?$/.exec(
      className || ""
    );
    if (match) {
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
        let execLang: ExecLang | undefined = undefined;
        switch (match[1]) {
          case "python":
            execLang = "python";
            break;
          case "cpp":
          case "c++":
            execLang = "cpp";
            break;
          default:
            console.warn(`Unsupported language for exec: ${match[1]}`);
            break;
        }
        if (execLang) {
          return (
            <div className="border border-primary border-2 shadow-md m-2 rounded-lg">
              <ExecFile
                language={execLang}
                filenames={match[3].split(",")}
                content={String(props.children || "").replace(/\n$/, "")}
              />
            </div>
          );
        }
      } else if (match[3]) {
        // ファイル名指定がある場合、ファイルエディター
        let aceLang: AceLang | undefined = undefined;
        switch (match[1]) {
          case "python":
            aceLang = "python";
            break;
          case "cpp":
          case "c++":
            aceLang = "c_cpp";
            break;
          case "json":
            aceLang = "json";
            break;
          case "csv":
            aceLang = "csv";
            break;
          case "text":
          case "txt":
            aceLang = "text";
            break;
          default:
            console.warn(`Unsupported language for editor: ${match[1]}`);
            break;
        }
        return (
          <div className="border border-primary border-2 shadow-md m-2 rounded-lg">
            <EditorComponent
              language={aceLang}
              tabSize={4}
              filename={match[3]}
              readonly={match[2] === "-readonly"}
              initContent={String(props.children || "").replace(/\n$/, "")}
            />
          </div>
        );
      } else if (match[2] === "-repl") {
        // repl付きの言語指定
        // 現状はPythonのみ対応
        switch (match[1]) {
          case "python":
            return (
              <div className="bg-base-300 border border-primary border-2 shadow-md m-2 p-4 pr-1 rounded-lg">
                <PythonEmbeddedTerminal
                  content={String(props.children || "").replace(/\n$/, "")}
                />
              </div>
            );
          default:
            console.warn(`Unsupported language for repl: ${match[1]}`);
            break;
        }
      }
      return (
        <SyntaxHighlighter
          language={match[1]}
          PreTag="div"
          className="border border-base-content/50 mx-2 my-2 rounded-lg text-sm p-4!"
          style={tomorrow} // todo dark theme (editor.tsx で指定したのと同じテーマを選ぶようにすること)
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
          className="border border-base-content/50 mx-2 my-2 rounded-lg text-sm p-4!"
          style={tomorrow} // todo dark theme
          {...props}
        >
          {String(props.children || "").replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    } else {
      // inline
      return (
        <code
          className="bg-base-200/60 border border-base-300 px-1 py-0.5 rounded text-sm "
          {...props}
        />
      );
    }
  },
};
