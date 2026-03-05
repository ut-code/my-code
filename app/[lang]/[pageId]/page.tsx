import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "./pageContent";
import { ChatHistoryProvider } from "./chatHistory";
import { getChatFromCache, initContext } from "@/lib/chatHistory";
import { getMarkdownSections, getPagesList } from "@/lib/docs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; pageId: string }>;
}): Promise<Metadata> {
  const { lang, pageId } = await params;
  const pagesList = await getPagesList();
  const langEntry = pagesList.find((l) => l.id === lang);
  const pageEntry = langEntry?.pages.find((p) => p.slug === pageId);
  if (!langEntry || !pageEntry) notFound();

  const sections = await getMarkdownSections(lang, pageId);
  const description = sections[0].rawContent;

  return {
    title: `${langEntry!.name}-${pageEntry.index}. ${pageEntry.title}`,
    description,
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
  const sections = await getMarkdownSections(lang, pageId);

  // AI用のドキュメント全文（rawContentを結合）
  const documentContent = sections.map((s) => s.rawContent).join("\n");

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
        pageEntry={pageEntry}
        lang={lang}
        pageId={pageId}
        langName={langEntry.name}
      />
    </ChatHistoryProvider>
  );
}
