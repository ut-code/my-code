import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import { MarkdownSection } from "../[docs_id]/splitMarkdown";
import { PageContent } from "../[docs_id]/pageContent";
import { ChatHistoryProvider } from "../[docs_id]/chatHistory";
import { getChatFromCache, initContext } from "@/lib/chatHistory";
import { getPagesList } from "@/lib/getPagesList";
import { isCloudflare } from "@/lib/detectCloudflare";

async function readDocFile(
  lang: string,
  pageId: string,
  filename: string
): Promise<string> {
  try {
    if (isCloudflare()) {
      const cfAssets = getCloudflareContext().env.ASSETS;
      const res = await cfAssets!.fetch(
        `https://assets.local/docs/${lang}/${pageId}/${filename}`
      );
      if (!res.ok) notFound();
      return await res.text();
    } else {
      return await readFile(
        join(process.cwd(), "public", "docs", lang, pageId, filename),
        "utf-8"
      );
    }
  } catch {
    notFound();
  }
}

/**
 * YAMLフロントマターをパースしてid, title, level, bodyを返す。
 * フロントマターがない場合はid/titleを空文字、levelを0で返す。
 */
function parseFrontmatter(content: string): {
  id: string;
  title: string;
  level: number;
  body: string;
} {
  if (!content.startsWith("---\n")) {
    return { id: "", title: "", level: 0, body: content };
  }
  const endIdx = content.indexOf("\n---\n", 4);
  if (endIdx === -1) {
    return { id: "", title: "", level: 0, body: content };
  }
  const fm = yaml.load(content.slice(4, endIdx)) as {
    id?: string;
    title?: string;
    level?: number;
  };
  const body = content.slice(endIdx + 5);
  return {
    id: fm?.id ?? "",
    title: fm?.title ?? "",
    level: fm?.level ?? 2,
    body,
  };
}

/**
 * public/docs/{lang}/{pageId}/ 以下のmdファイルを結合して MarkdownSection[] を返す。
 */
async function getMarkdownSections(
  lang: string,
  pageId: string,
  pageTitle: string
): Promise<MarkdownSection[]> {
  const sectionsYml = await readDocFile(lang, pageId, "sections.yml");
  const files = yaml.load(sectionsYml) as string[];

  const sections: MarkdownSection[] = [];
  for (const file of files) {
    const raw = await readDocFile(lang, pageId, file);
    if (file === "-intro.md") {
      // イントロセクションはフロントマターなし・見出しなし
      sections.push({
        id: `${lang}-${pageId}-intro`,
        level: 1,
        title: pageTitle,
        content: raw.trim(),
        rawContent: raw.trim(),
      });
    } else {
      const { id, title, level, body } = parseFrontmatter(raw);
      // bodyには見出し行が含まれるので、contentとしては見出しを除いた本文のみを渡す
      const content = body.replace(/^#{1,6} [^\n]*\n?/, "").trim();
      sections.push({
        id,
        level,
        title,
        content,
        rawContent: body.trim(),
      });
    }
  }
  return sections;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; pageId: string }>;
}): Promise<Metadata> {
  const { lang, pageId } = await params;
  const pagesList = await getPagesList();
  const langEntry = pagesList.find((l) => l.id === lang);
  const pageIndex = langEntry?.pages.findIndex((p) => p.slug === pageId) ?? -1;
  const pageEntry = pageIndex >= 0 ? langEntry?.pages[pageIndex] : undefined;
  if (!langEntry || !pageEntry) notFound();

  return {
    title: `${langEntry!.name}-${pageIndex + 1}. ${pageEntry!.name}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; pageId: string }>;
}) {
  const { lang, pageId } = await params;
  const pagesList = await getPagesList();
  const langEntry = pagesList.find((l) => l.id === lang);
  const pageEntry = langEntry?.pages.find((p) => p.slug === pageId);
  if (!langEntry || !pageEntry) notFound();

  const docsId = `${lang}/${pageId}`;
  const sections = await getMarkdownSections(lang, pageId, pageEntry!.name);

  // AI用のドキュメント全文（見出し付きで結合）
  const documentContent = sections
    .map((s) =>
      s.level > 0 ? `${"#".repeat(s.level)} ${s.title}\n\n${s.content}` : s.content
    )
    .join("\n\n");

  const context = await initContext();
  const initialChatHistories = await getChatFromCache(docsId, context);

  return (
    <ChatHistoryProvider
      initialChatHistories={initialChatHistories}
      docs_id={docsId}
    >
      <PageContent
        documentContent={documentContent}
        splitMdContent={sections}
        docs_id={docsId}
      />
    </ChatHistoryProvider>
  );
}
