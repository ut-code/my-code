import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "./pageContent";
import {
  applyChatDiff,
  getChatFromCache,
  initContext,
} from "@/lib/chatHistory";
import {
  getMarkdownSections,
  getPagesListForLang,
  getTermDefinitions,
  LangId,
  PageSlug,
} from "@/lib/docs";
import { DocsAutoRedirect } from "./autoRedirect";
import { TermDefinitionProvider } from "@/markdown/term";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: LangId; pageId: PageSlug }>;
}): Promise<Metadata> {
  const { lang, pageId } = await params;
  const langEntry = await getPagesListForLang(lang);
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

  // server componentなのでuseMemoいらない
  const path = { lang: lang, page: pageId };
  const sections = await getMarkdownSections(lang, pageId);

  const context = await initContext();
  const chatHistories = await getChatFromCache(path, context.userId);

  const termDefinitions = await getTermDefinitions(lang);

  const splitMdContent = applyChatDiff(sections, chatHistories);

  return (
    <>
      <TermDefinitionProvider
        termDefinitions={termDefinitions}
        lang={lang}
        page={pageId}
      >
        <PageContent
          chatHistories={chatHistories}
          splitMdContent={splitMdContent}
          langId={lang}
          pageSlug={pageId}
          path={path}
        />
      </TermDefinitionProvider>
      <DocsAutoRedirect path={path} />
    </>
  );
}

