"use server";

import { deleteChat, initContext } from "@/lib/chatHistory";

export async function deleteChatAction(chatId: string) {
  const ctx = await initContext();
  await deleteChat(chatId, ctx);
}
