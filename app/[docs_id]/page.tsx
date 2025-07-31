import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Markdown, { Components } from "react-markdown";

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
      "utf-8",
    );
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="p-4">
      <Markdown components={components}>{mdContent}</Markdown>
    </div>
  );
}

// TailwindCSSがh1などのタグのスタイルを消してしまうので、手動でスタイルを指定する必要がある
const components: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-2xl font-bold my-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-xl font-semibold my-3" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-lg font-medium my-2" {...props} />
  ),
  p: ({ node, ...props }) => <p className="my-2" {...props} />,
};
