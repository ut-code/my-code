"use server";

import { initContext } from "@/lib/chatHistory";
import { chat, diff, message } from "@/schema/chat";
import { and, eq } from "drizzle-orm";

export async function deleteChatAction(chatId: string) {
  const ctx = await initContext();
  if (!ctx.userId) {
    throw new Error("Not authenticated");
  }
  const deletedUser = await ctx.drizzle
    .delete(chat)
    .where(and(eq(chat.chatId, chatId), eq(chat.userId, ctx.userId)))
    .returning();
  if (deletedUser.length === 0) {
    throw new Error("Chat not found or not authorized");
  }
  await ctx.drizzle.delete(message).where(eq(message.chatId, chatId));
  await ctx.drizzle.delete(diff).where(eq(diff.chatId, chatId));
}
