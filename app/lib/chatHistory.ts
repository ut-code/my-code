"use server";

import { headers } from "next/headers";
import { getAuthServer } from "./auth";
import { getDrizzle } from "./drizzle";
import { chat, message } from "@/schema/chat";
import { and, asc, eq } from "drizzle-orm";
import { Auth } from "better-auth";
import { inMemoryCache } from "./cache";

export interface CreateChatMessage {
  role: "user" | "ai" | "error";
  content: string;
}

// cacheに使うキーで、実際のURLではない
const CACHE_KEY_BASE = "https://my-code.utcode.net/chatHistory";

interface Context {
  drizzle: Awaited<ReturnType<typeof getDrizzle>>;
  auth: Auth;
  userId?: string;
}
/**
 * drizzleが初期化されてなければ初期化し、
 * authが初期化されてなければ初期化し、
 * userIdがなければセッションから取得してセットする。
 */
async function initAll(ctx?: Partial<Context>): Promise<Context> {
  if (!ctx) {
    ctx = {};
  }
  if (!ctx.drizzle) {
    ctx.drizzle = await getDrizzle();
  }
  if (!ctx.auth) {
    ctx.auth = await getAuthServer(ctx.drizzle);
  }
  if (!ctx.userId) {
    try {
      const session = await ctx.auth.api.getSession({
        headers: await headers(),
      });
      if (session) {
        ctx.userId = session.user.id;
      }
    } catch (e) {
      console.error("Failed to get session in initAll:", e);
    }
  }
  return ctx as Context;
}
async function getCache() {
  if ("caches" in globalThis) {
    // worker
    return await caches.open("chatHistory");
  } else {
    // nodejs
    return inMemoryCache;
  }
}

export async function addChat(
  docsId: string,
  sectionId: string,
  messages: CreateChatMessage[],
  context?: Partial<Context>
) {
  const { drizzle, userId } = await initAll(context);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const [newChat] = await drizzle
    .insert(chat)
    .values({
      userId,
      docsId,
      sectionId,
    })
    .returning();

  const chatMessages = await drizzle
    .insert(message)
    .values(
      messages.map((msg) => ({
        chatId: newChat.chatId,
        role: msg.role,
        content: msg.content,
      }))
    )
    .returning();

  console.log(
    `deleting cache for chatHistory/getChat for user ${userId} and docs ${docsId}`
  );
  const cache = await getCache();
  await cache.delete(
    `${CACHE_KEY_BASE}/getChat?docsId=${docsId}&userId=${userId}`
  );

  return {
    ...newChat,
    messages: chatMessages,
  };
}

export type ChatWithMessages = Awaited<ReturnType<typeof addChat>>;

export async function getChat(
  docsId: string,
  context?: Partial<Context>
): Promise<ChatWithMessages[]> {
  const { drizzle, userId } = await initAll(context);
  if (!userId) {
    return [];
  }

  const chats = await drizzle.query.chat.findMany({
    where: and(eq(chat.userId, userId), eq(chat.docsId, docsId)),
    with: {
      messages: {
        orderBy: [asc(message.createdAt)],
      },
    },
    orderBy: [asc(chat.createdAt)],
  });

  const cache = await getCache();
  await cache.put(
    `${CACHE_KEY_BASE}/getChat?docsId=${docsId}&userId=${userId}`,
    new Response(JSON.stringify(chats), {
      headers: { "Cache-Control": "max-age=86400, s-maxage=86400" },
    })
  );
  return chats;
}
export async function getChatFromCache(
  docsId: string,
  context?: Partial<Context>
) {
  const { drizzle, auth, userId } = await initAll(context);
  if (!userId) {
    return [];
  }

  const cache = await getCache();
  const cachedResponse = await cache.match(
    `${CACHE_KEY_BASE}/getChat?docsId=${docsId}&userId=${userId}`
  );
  if (cachedResponse) {
    console.log("Cache hit for chatHistory/getChat");
    const data = (await cachedResponse.json()) as ChatWithMessages[];
    return data;
  }
  console.log("Cache miss for chatHistory/getChat");
  return await getChat(docsId, { drizzle, auth, userId });
}

export async function migrateChatUser(oldUserId: string, newUserId: string) {
  const drizzle = await getDrizzle();
  await drizzle
    .update(chat)
    .set({ userId: newUserId })
    .where(eq(chat.userId, oldUserId));
}
