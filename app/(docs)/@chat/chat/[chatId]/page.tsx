import {
  cacheKeyForChat,
  ChatWithMessages,
  getChatOne,
  initContext,
} from "@/lib/chatHistory";
import { getMarkdownSections, getPagesList } from "@/lib/docs";
import { ChatAreaContainer, ChatAreaContent } from "./chatArea";
import { cacheLife, cacheTag } from "next/cache";
import { isCloudflare } from "@/lib/detectCloudflare";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const context = await initContext();
  const chatData = await getChatOneFromCache(chatId, context.userId);

  if (!chatData) {
    // notFound(); だとページ全体が404になってしまう
    return (
      <ChatAreaContainer chatId={chatId}>
        <p>指定されたチャットのデータが見つかりません。</p>
      </ChatAreaContainer>
    );
  }

  const pagesList = await getPagesList();
  const targetLang = pagesList.find(
    (lang) => lang.id === chatData.section.pagePath.split("/")[0]
  );
  const targetPage = targetLang?.pages.find(
    (page) => page.slug === chatData.section.pagePath.split("/")[1]
  );
  const sections =
    targetLang && targetPage
      ? await getMarkdownSections(targetLang.id, targetPage.slug)
      : [];
  const targetSection = sections.find((sec) => sec.id === chatData.sectionId);

  return (
    <ChatAreaContainer chatId={chatId}>
      <ChatAreaContent
        chatId={chatId}
        chatData={chatData}
        targetLang={targetLang}
        targetPage={targetPage}
        targetSection={targetSection}
      />
    </ChatAreaContainer>
  );
}

async function getChatOneFromCache(chatId: string, userId?: string) {
  "use cache";
  cacheLife("days");
  cacheTag(cacheKeyForChat(chatId));

  if (!userId) {
    return null;
  }

  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    const cachedResponse = await cache.match(cacheKeyForChat(chatId));
    if (cachedResponse) {
      const data = (await cachedResponse.json()) as ChatWithMessages;
      return data;
    }
  }

  const context = await initContext({ userId });
  const chatData = await getChatOne(chatId, context);
  return chatData;
}
