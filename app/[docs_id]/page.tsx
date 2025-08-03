import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ChatForm } from "./chatForm";
import { StyledMarkdown } from "./markdown";

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
      <StyledMarkdown content={mdContent} />
      <ChatForm />
    </div>
  );
}

