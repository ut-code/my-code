"use server";

import { z } from "zod";
import { deleteChat, initContext, revalidateChat } from "@/lib/chatHistory";
import { section } from "@/schema/chat";
import { eq } from "drizzle-orm";

export async function deleteChatAction(chatId: string) {
  chatId = z.uuid().parse(chatId);
  const ctx = await initContext();
  if (!ctx.userId) {
    throw new Error("Not authenticated");
  }
  const deletedChat = await deleteChat(chatId, ctx);

  const targetSection = await ctx.drizzle.query.section.findFirst({
    where: eq(section.sectionId, deletedChat[0].sectionId),
  });
  if (targetSection) {
    await revalidateChat(chatId, ctx.userId, targetSection.pagePath);
  }
}
