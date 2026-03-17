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
  getPagesList,
  LangId,
  PagePath,
  PageSlug,
} from "@/lib/docs";
import { unstable_cacheLife, unstable_cacheTag } from "next/cache";
import { isCloudflare } from "@/lib/detectCloudflare";

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
  const pageEntryIndex =
    langEntry?.pages.findIndex((p) => p.slug === pageId) ?? -1;
  const pageEntry = langEntry?.pages[pageEntryIndex];
  if (!langEntry || !pageEntry) notFound();

  const prevPage = langEntry.pages[pageEntryIndex - 1];
  const nextPage = langEntry.pages[pageEntryIndex + 1];

  // server componentなのでuseMemoいらない
  const path = { lang: lang, page: pageId };
  const sections = await getMarkdownSections(lang, pageId);

  const context = await initContext();
  const chatHistories = await getChatFromCache(path, context.userId);

  return (
    <PageContent
      chatHistories={chatHistories}
      splitMdContent={sections}
      langEntry={langEntry}
      pageEntry={pageEntry}
      prevPage={prevPage}
      nextPage={nextPage}
      path={path}
    />
  );
}

export async function getChatFromCache(path: PagePath, userId?: string) {
  // チャットの取得をキャッシュする。
  // use cacheの仕様で、drizzleオブジェクトとauthオブジェクトは引数に渡せない。
  // 一方、use cacheの関数内でheaders()にはアクセスできない。
  // したがって、外でheaders()を使ってuserIdを取得した後、関数の中で再度drizzleを初期化しないといけない。
  "use cache";
  unstable_cacheLife("days");

  if (!userId) {
    return [];
  }
  unstable_cacheTag(cacheKeyForPage(path, userId));

  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    const cachedResponse = await cache.match(cacheKeyForPage(path, userId));
    if (cachedResponse) {
      // console.log("Cache hit for chatHistory/getChat");
      const data = (await cachedResponse.json()) as ChatWithMessages[];
      return data;
    } else {
      // console.log("Cache miss for chatHistory/getChat");
    }
  }
  const ctx = await initContext({ userId });
  return await getAllChat(path, ctx);
}
