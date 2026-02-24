import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { splitMarkdown } from "./splitMarkdown";
import { PageContent } from "./pageContent";
import { ChatHistoryProvider } from "./chatHistory";
import { getChatFromCache, initContext } from "@/lib/chatHistory";
import { getPagesList } from "@/lib/getPagesList";
import { isCloudflare } from "@/lib/detectCloudflare";

async function getMarkdownContent(docs_id: string): Promise<string> {
  try {
    if (isCloudflare()) {
      const cfAssets = getCloudflareContext().env.ASSETS;
      const res = await cfAssets!.fetch(
        `https://assets.local/docs/${docs_id}.md`
      );
      if (!res.ok) {
        notFound();
      }
      return await res.text();
    } else {
      return await readFile(
        join(process.cwd(), "public", "docs", `${docs_id}.md`),
        "utf-8"
      );
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

  const description = splitMdContent[0].rawContent;

  const [lang_id, chapter] = docs_id.split("-");
  const pagesList = await getPagesList();
  const langName = pagesList.find((l) => l.id === lang_id)?.name ?? lang_id;

  return {
    title: `${langName}-${chapter}. ${title}`,
    description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;
  const [lang_id, page_num_str] = docs_id.split("-");
  const page_num = parseInt(page_num_str);
  const pagesList = await getPagesList();
  if (
    !pagesList
      .find((lang) => lang.id === lang_id)
      ?.pages.find((_, idx) => idx + 1 === page_num)
  ) {
    notFound();
  }

  const mdContent = getMarkdownContent(docs_id);
  const splitMdContent = mdContent.then((text) => splitMarkdown(text));
  const context = await initContext();
  const initialChatHistories = getChatFromCache(docs_id, context);

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
