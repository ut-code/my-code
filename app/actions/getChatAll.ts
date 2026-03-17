"use server";

import { getAllChat, initContext } from "@/lib/chatHistory";
import { PagePath } from "@/lib/docs";

export async function getChatAllWithoutCache(path: PagePath) {
  const ctx = await initContext();
  return await getAllChat(path, ctx);
}
