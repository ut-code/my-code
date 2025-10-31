import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MarkdownSection, splitMarkdown } from "./splitMarkdown";
import { PageContent } from "./pageContent";
import { ChatHistoryProvider } from "./chatHistory";
import { getChatFromCache } from "@/lib/chatHistory";

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;

  let mdContent: Promise<string>;
  if (process.env.NODE_ENV === "development") {
    mdContent = readFile(
      join(process.cwd(), "public", "docs", `${docs_id}.md`),
      "utf-8"
    ).catch((e) => {
      console.error(e);
      notFound();
    });
  } else {
    const cfAssets = getCloudflareContext().env.ASSETS;
    mdContent = cfAssets!
      .fetch(`https://assets.local/docs/${docs_id}.md`)
      .then(async (res) => {
        if (!res.ok) {
          notFound();
        }
        return res.text();
      })
      .catch((e) => {
        console.error(e);
        notFound();
      });
  }

  const splitMdContent: Promise<MarkdownSection[]> = mdContent.then((text) =>
    splitMarkdown(text)
  );

  const initialChatHistories = getChatFromCache(docs_id);

  return (
    <ChatHistoryProvider initialChatHistories={await initialChatHistories} docs_id={docs_id}>
      <PageContent
        documentContent={await mdContent}
        splitMdContent={await splitMdContent}
        docs_id={docs_id}
      />
    </ChatHistoryProvider>
  );
}
