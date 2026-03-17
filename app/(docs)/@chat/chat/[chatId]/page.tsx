import { getChatOne, initContext } from "@/lib/chatHistory";
import { getMarkdownSections, getPagesList } from "@/lib/docs";
import { ChatAreaContent } from "./chatArea";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const ctx = await initContext();
  const chatData = await getChatOne(chatId, ctx);

  const pagesList = await getPagesList();
  const targetLang = pagesList.find(
    (lang) => lang.id === chatData.section.pagePath.split("/")[0]
  );
  const targetPage = targetLang?.pages.find(
    (page) => page.slug === chatData.section.pagePath.split("/")[1]
  );
  const sections = await getMarkdownSections(targetLang!.id, targetPage!.slug);
  const targetSection = sections.find((sec) => sec.id === chatData.sectionId);

  return (
    <ChatAreaContent
      chatId={chatId}
      chatData={chatData}
      targetLang={targetLang}
      targetPage={targetPage}
      targetSection={targetSection}
    />
  );
}
