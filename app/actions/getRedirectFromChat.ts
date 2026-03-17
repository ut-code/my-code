"use server";

import { initContext } from "@/lib/chatHistory";
import { LangId, PageSlug } from "@/lib/docs";
import { chat, section } from "@/schema/chat";
import { and, eq } from "drizzle-orm";

export async function getRedirectFromChat(chatId: string): Promise<string> {
  const { drizzle, userId } = await initContext();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const chatData = (await drizzle.query.chat.findFirst({
    where: and(eq(chat.chatId, chatId), eq(chat.userId, userId)),
    with: {
      section: true,
    },
  })) as
    | (typeof chat.$inferSelect & {
        section: typeof section.$inferSelect;
      })
    | undefined;
  if (!chatData?.section) {
    throw new Error("Chat or section not found");
  }
  const [lang, page] = (chatData.section.pagePath.split("/") ?? []) as [
    LangId,
    PageSlug,
  ];
  return `/${lang}/${page}#${chatData.sectionId}`;
}
