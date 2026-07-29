import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "./pageContent";
import {
  cacheKeyForPage,
  ChatWithMessages,
  getAllChat,
  initContext,
} from "@/lib/chatHistory";
import {
  getMarkdownSections,
  getPagesListForLang,
  getTermDefinitions,
  LangId,
  PagePath,
  PageSlug,
} from "@/lib/docs";
import { cacheLife, cacheTag } from "next/cache";
import { isCloudflare } from "@/lib/detectCloudflare";
import { DocsAutoRedirect } from "./autoRedirect";
import { dateReviver } from "@/lib/dateReviver";
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

  return (
    <>
      <TermDefinitionProvider termDefinitions={termDefinitions} lang={lang}>
        <PageContent
          chatHistories={chatHistories}
          splitMdContent={sections}
          langId={lang}
          pageSlug={pageId}
          path={path}
        />
      </TermDefinitionProvider>
      <DocsAutoRedirect path={path} />
    </>
  );
}

async function getChatFromCache(path: PagePath, userId?: string) {
  // チャットの取得をキャッシュする。
  // use cacheの仕様で、drizzleオブジェクトとauthオブジェクトは引数に渡せない。
  // 一方、use cacheの関数内でheaders()にはアクセスできない。
  // したがって、外でheaders()を使ってuserIdを取得した後、関数の中で再度drizzleを初期化しないといけない。
  "use cache";
  cacheLife("days");

  if (!userId) {
    return [];
  }
  cacheTag(cacheKeyForPage(path, userId));

  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    const cachedResponse = await cache.match(cacheKeyForPage(path, userId));
    if (cachedResponse) {
      // console.log("Cache hit for chatHistory/getChat");
      const data = JSON.parse(
        await cachedResponse.text(),
        dateReviver
      ) as ChatWithMessages[];
      return data;
    } else {
      // console.log("Cache miss for chatHistory/getChat");
    }
  }
  const ctx = await initContext({ userId });
  return await getAllChat(path, ctx);
}
