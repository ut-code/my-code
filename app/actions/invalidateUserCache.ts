"use server";

import { updateTag } from "next/cache";
import { initContext, cacheKeyForPage } from "@/lib/chatHistory";
import { getPagesList } from "@/lib/docs";
import { isCloudflare } from "@/lib/detectCloudflare";

export async function invalidateCurrentUserChatCache() {
  const ctx = await initContext();
  if (!ctx.userId) {
    return;
  }
  const pagesList = await getPagesList();
  for (const lang of pagesList) {
    for (const page of lang.pages) {
      updateTag(cacheKeyForPage({ lang: lang.id, page: page.slug }, ctx.userId));
    }
  }
  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    for (const lang of pagesList) {
      for (const page of lang.pages) {
        await cache.delete(
          cacheKeyForPage({ lang: lang.id, page: page.slug }, ctx.userId)
        );
      }
    }
  }
}
