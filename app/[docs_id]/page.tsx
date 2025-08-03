import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Markdown, { Components } from "react-markdown";
import { ChatForm } from "./chatForm";

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;

  let mdContent: string;
  try {
    mdContent = await readFile(
      join(process.cwd(), "docs", `${docs_id}.md`),
      "utf-8"
    );
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="p-4">
      <Markdown components={components}>{mdContent}</Markdown>
      <ChatForm />
    </div>
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
  a: ({ node, ...props }) => <a className="link link-primary" {...props} />,
  code: ({ node, ...props }) => (
    <code
      className="bg-base-200 border border-base-300 p-1 rounded font-mono text-sm "
      {...props}
    />
  ),
  pre: ({ node, ...props }) => (
    <pre
      className="bg-base-200 border border-primary mx-2 my-2 px-4 py-2 rounded-lg font-mono text-sm overflow-x-auto"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => (
    <hr className="border-primary my-4" {...props} />
  ),
};
