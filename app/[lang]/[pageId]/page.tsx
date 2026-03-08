import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "./pageContent";
import { ChatHistoryProvider } from "./chatHistory";
import { getChatFromCache, initContext } from "@/lib/chatHistory";
import {
  getMarkdownSections,
  getPagesList,
  LangId,
  PageSlug,
} from "@/lib/docs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: LangId; pageId: PageSlug }>;
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
  params: Promise<{ lang: LangId; pageId: PageSlug }>;
}) {
  const { lang, pageId } = await params;
  const pagesList = await getPagesList();
  const langEntry = pagesList.find((l) => l.id === lang);
  const pageEntry = langEntry?.pages.find((p) => p.slug === pageId);
  if (!langEntry || !pageEntry) notFound();

  // server componentなのでuseMemoいらない
  const path = { lang: lang, page: pageId };
  const sections = await getMarkdownSections(lang, pageId);

  const context = await initContext();
  const initialChatHistories = await getChatFromCache(path, context);

  return (
    <ChatHistoryProvider
      initialChatHistories={initialChatHistories}
      path={path}
    >
      <PageContent
        splitMdContent={sections}
        langEntry={langEntry}
        pageEntry={pageEntry}
        path={path}
      />
    </ChatHistoryProvider>
  );
}
