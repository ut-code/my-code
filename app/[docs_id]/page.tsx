import { notFound } from "next/navigation";
import { ChatForm } from "./chatForm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MarkdownSection, splitMarkdown } from "./splitMarkdown";
import { Section } from "./section";

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;

  let mdContent: string;
  try {
    if (process.env.NODE_ENV === "development") {
      mdContent = await readFile(
        join(process.cwd(), "public", "docs", `${docs_id}.md`),
        "utf-8"
      );
    } else {
      const cfAssets = getCloudflareContext().env.ASSETS;
      mdContent = await cfAssets!
        .fetch(`https://assets.local/docs/${docs_id}.md`)
        .then((res) => res.text());
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  const splitMdContent: MarkdownSection[] = await splitMarkdown(mdContent);

  return (
    <div className="p-4">
      {splitMdContent.map((section, index) => (
        <Section key={index} section={section} />
      ))}
      <ChatForm />
    </div>
  );
}
