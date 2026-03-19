"use server";

import { z } from "zod";
import { deleteChat, initContext } from "@/lib/chatHistory";

export async function deleteChatAction(chatId: string) {
  chatId = z.uuid().parse(chatId);
  const ctx = await initContext();
  await deleteChat(chatId, ctx);
}
