"use server";

import { z } from "zod";
import { deleteChat, initContext } from "@/lib/chatHistory";

const chatIdSchema = z.string().uuid();

export async function deleteChatAction(chatId: string) {
  const parsed = chatIdSchema.safeParse(chatId);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }
  const ctx = await initContext();
  await deleteChat(parsed.data, ctx);
}
