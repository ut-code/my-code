import {
  cacheKeyForChat,
  ChatWithMessages,
  getChatOne,
  initContext,
} from "@/lib/chatHistory";
import {
  getMarkdownSections,
  LangId,
  PageSlug,
} from "@/lib/docs";
import { ChatAreaContainer, ChatAreaContent } from "./chatArea";
import { cacheLife, cacheTag } from "next/cache";
import { isCloudflare } from "@/lib/detectCloudflare";
import { dateReviver } from "@/lib/dateReviver";

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

  const [langId, pageSlug] = chatData.section.pagePath.split("/") as [
    LangId,
    PageSlug,
  ];
  const sections = await getMarkdownSections(langId, pageSlug);
  const targetSection = sections.find((sec) => sec.id === chatData.sectionId);

  return (
    <ChatAreaContainer chatId={chatId}>
      <ChatAreaContent
        chatId={chatId}
        chatData={chatData}
        langId={langId}
        pageSlug={pageSlug}
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
      const data = JSON.parse(
        await cachedResponse.text(),
        dateReviver
      ) as ChatWithMessages;
      return data;
    }
  }

  const context = await initContext({ userId });
  const chatData = await getChatOne(chatId, context);
  return chatData;
}
