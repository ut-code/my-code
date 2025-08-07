import { notFound } from "next/navigation";
import { ChatForm } from "./chatForm";
import { StyledMarkdown } from "./markdown";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises"; 
import { join } from "node:path";

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;

  let mdContent: string;
  try {
    if (process.env.NODE_ENV === 'development') {
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

  return (
    <div className="p-4">
      <StyledMarkdown content={mdContent} />
      <ChatForm />
    </div>
  );
}
