"use server";

import { initContext, revalidateChat } from "@/lib/chatHistory";
import { LangId, PagePath, PagePathSchema, PageSlug } from "@/lib/docs";
import z from "zod";

export async function revalidateChatAction(
  chatId: string,
  pagePath: string | PagePath
) {
  chatId = z.uuid().parse(chatId);
  if (typeof pagePath === "string") {
    if (!/^[a-z0-9-_]+\/[a-z0-9-_]+$/.test(pagePath)) {
      throw new Error("Invalid pagePath format");
    }
    const [lang, page] = pagePath.split("/") as [LangId, PageSlug];
    pagePath = { lang, page };
  } else {
    pagePath = PagePathSchema.parse(pagePath);
  }
  const ctx = await initContext();
  if (!ctx.userId) {
    throw new Error("Not authenticated");
  }
  await revalidateChat(chatId, ctx.userId, pagePath);
}
