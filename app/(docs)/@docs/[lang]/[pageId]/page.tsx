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
  MarkdownSection,
  PagePath,
  PageSlug,
  ReplacedRange,
  SectionWithDiff,
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

function applyChatDiff(
  splitMdContent: MarkdownSection[],
  chatHistories: ChatWithMessages[]
): SectionWithDiff[] {
  const newContent: SectionWithDiff[] = splitMdContent.map((section) => ({
    ...section,
    replacedContent: section.rawContent,
    replacedRange: [] as ReplacedRange[],
  }));
  const chatDiffs = chatHistories.map((chat) => chat.diff).flat();
  chatDiffs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  for (const diff of chatDiffs) {
    const targetSection = newContent.find((s) => s.id === diff.sectionId);
    if (targetSection) {
      const startIndex = targetSection.replacedContent.indexOf(diff.search);
      if (startIndex !== -1) {
        const endIndex = startIndex + diff.search.length;
        const replaceLen = diff.replace.length;
        const diffLen = replaceLen - diff.search.length; // 文字列長の増減分

        // 1. 文字列の置換
        targetSection.replacedContent =
          targetSection.replacedContent.slice(0, startIndex) +
          diff.replace +
          targetSection.replacedContent.slice(endIndex);

        // 2. 既存のハイライト範囲のズレを補正（今回の置換箇所より後ろにあるものをシフト）
        targetSection.replacedRange = targetSection.replacedRange.map((h) => {
          if (h.start >= endIndex) {
            // 完全に後ろにある場合は単純にシフト
            return {
              start: h.start + diffLen,
              end: h.end + diffLen,
              id: h.id,
            };
          }
          if (h.end >= endIndex) {
            return { start: h.start, end: h.end + diffLen, id: h.id };
          }
          return h;
        });

        // 3. 今回の置換箇所を新たなハイライト範囲として追加
        targetSection.replacedRange.push({
          start: startIndex,
          end: startIndex + replaceLen,
          id: diff.chatId,
        });
      } else {
        // TODO: md5ハッシュを参照し過去バージョンのドキュメントへ適用を試みる
        console.error(
          `Failed to apply diff: search string "${diff.search}" not found in section ${targetSection.id}`
        );
      }
    } else {
      console.error(
        `Failed to apply diff: section with id "${diff.sectionId}" not found`
      );
    }
  }

  return newContent;
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
