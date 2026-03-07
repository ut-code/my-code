"use server";

import { headers } from "next/headers";
import { getAuthServer } from "./auth";
import { getDrizzle } from "./drizzle";
import { chat, message } from "@/schema/chat";
import { and, asc, eq } from "drizzle-orm";
import { Auth } from "better-auth";
import { revalidateTag, unstable_cacheLife } from "next/cache";
import { isCloudflare } from "./detectCloudflare";
import { unstable_cacheTag } from "next/cache";
import { PagePath, SectionId } from "./docs";

export interface CreateChatMessage {
  role: "user" | "ai" | "error";
  content: string;
}

// cacheに使うキーで、実際のURLではない
const CACHE_KEY_BASE = "https://my-code.utcode.net/chatHistory";
function cacheKeyForPage(path: PagePath, userId: string) {
  return `${CACHE_KEY_BASE}/getChat?path=${path.lang}/${path.page}&userId=${userId}`;
}

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
export async function initContext(ctx?: Partial<Context>): Promise<Context> {
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
    const session = await ctx.auth.api.getSession({
      headers: await headers(),
    });
    if (session) {
      ctx.userId = session.user.id;
    }
  }
  return ctx as Context;
}

export async function addChat(
  sectionId: SectionId,
  messages: CreateChatMessage[],
  context?: Partial<Context>
) {
  const { drizzle, userId } = await initContext(context);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const [newChat] = await drizzle
    .insert(chat)
    .values({
      userId,
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

  revalidateTag(cacheKeyForPage({}, userId));
  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    console.log(
      `deleting cache for chatHistory/getChat for user ${userId} and docs ${lang}/${page}`
    );
    await cache.delete(cacheKeyForPage({}, userId));
  }

  return {
    ...newChat,
    messages: chatMessages,
  };
}

export type ChatWithMessages = Awaited<ReturnType<typeof addChat>>;

export async function getChat(
  path: PagePath,
  context?: Partial<Context>
): Promise<ChatWithMessages[]> {
  const { drizzle, userId } = await initContext(context);
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

  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    await cache.put(
      cacheKeyForPage(path, userId),
      new Response(JSON.stringify(chats), {
        headers: { "Cache-Control": "max-age=86400, s-maxage=86400" },
      })
    );
  }
  return chats;
}
export async function getChatFromCache(path: PagePath, context: Context) {
  "use cache";
  unstable_cacheLife("days");

  // cacheされる関数の中でheader()にはアクセスできない。
  // なので外でinitContext()を呼んだものを引数に渡す必要がある。
  // しかし、drizzleオブジェクトは外から渡せないのでgetChatの中で改めてinitContext()を呼んでdrizzleだけ再初期化している
  const { auth, userId } = context;
  if (!userId) {
    return [];
  }
  unstable_cacheTag(cacheKeyForPage(path, userId));

  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    const cachedResponse = await cache.match(cacheKeyForPage(path, userId));
    if (cachedResponse) {
      console.log("Cache hit for chatHistory/getChat");
      const data = (await cachedResponse.json()) as ChatWithMessages[];
      return data;
    } else {
      console.log("Cache miss for chatHistory/getChat");
    }
  }
  return await getChat(path, { auth, userId });
}

export async function migrateChatUser(oldUserId: string, newUserId: string) {
  const drizzle = await getDrizzle();
  await drizzle
    .update(chat)
    .set({ userId: newUserId })
    .where(eq(chat.userId, oldUserId));
}
