import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { splitMarkdown } from "./splitMarkdown";
import { PageContent } from "./pageContent";
import { ChatHistoryProvider } from "./chatHistory";
import { getChatFromCache } from "@/lib/chatHistory";
import { getLanguageName, pagesList } from "@/pagesList";

async function getMarkdownContent(docs_id: string): Promise<string> {
  try {
    if (process.env.NODE_ENV === "development") {
      return await readFile(
        join(process.cwd(), "public", "docs", `${docs_id}.md`),
        "utf-8"
      );
    } else {
      const cfAssets = getCloudflareContext().env.ASSETS;
      const res = await cfAssets!.fetch(
        `https://assets.local/docs/${docs_id}.md`
      );
      if (!res.ok) {
        notFound();
      }
      return await res.text();
    }
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}): Promise<Metadata> {
  const { docs_id } = await params;
  const mdContent = await getMarkdownContent(docs_id);
  const splitMdContent = splitMarkdown(mdContent);

  // 先頭の 第n章: を除いたものをタイトルとする
  const title = splitMdContent[0]?.title?.split(" ").slice(1).join(" ");

  const description = splitMdContent[0].content;

  const chapter = docs_id.split("-")[1];

  return {
    title: `${getLanguageName(docs_id)}-${chapter}. ${title}`,
    description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;

  if (
    !pagesList
      .find((lang) => docs_id.startsWith(`${lang.id}-`))
      ?.pages.find((page) => docs_id.endsWith(`-${page.id}`))
  ) {
    notFound();
  }

  const mdContent = getMarkdownContent(docs_id);
  const splitMdContent = mdContent.then((text) => splitMarkdown(text));
  const initialChatHistories = getChatFromCache(docs_id);

  return (
    <ChatHistoryProvider
      initialChatHistories={await initialChatHistories}
      docs_id={docs_id}
    >
      <PageContent
        documentContent={await mdContent}
        splitMdContent={await splitMdContent}
        docs_id={docs_id}
      />
    </ChatHistoryProvider>
  );
}
