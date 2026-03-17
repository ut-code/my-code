import { headers } from "next/headers";
import { getAuthServer } from "./auth";
import { getDrizzle } from "./drizzle";
import { chat, diff, message, section } from "@/schema/chat";
import { and, asc, eq, exists } from "drizzle-orm";
import { Auth } from "better-auth";
import { revalidateTag } from "next/cache";
import { isCloudflare } from "./detectCloudflare";
import { PagePath, SectionId } from "./docs";

export interface CreateChatMessage {
  role: "user" | "ai" | "error";
  content: string;
}
export interface CreateChatDiff {
  search: string;
  replace: string;
  sectionId: SectionId;
  targetMD5: string;
}

// cacheに使うキーで、実際のURLではない
const CACHE_KEY_BASE = "https://my-code.utcode.net/chatHistory";
export function cacheKeyForPage(path: PagePath, userId: string) {
  return `${CACHE_KEY_BASE}/getChat?path=${path.lang}/${path.page}&userId=${userId}`;
}

interface Context {
  drizzle: Awaited<ReturnType<typeof getDrizzle>>;
  auth: Auth;
  userId?: string;
}
/**
 * drizzleとbetterAuthをまとめて初期化する関数
 *
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
  path: PagePath,
  sectionId: SectionId,
  messages: CreateChatMessage[],
  diffRaw: CreateChatDiff[],
  context: Context
) {
  const { drizzle, userId } = context;
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

  const chatDiffs = await drizzle
    .insert(diff)
    .values(
      diffRaw.map((d) => ({
        chatId: newChat.chatId,
        ...d,
      }))
    )
    .returning();

  revalidateTag(cacheKeyForPage(path, userId));
  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    console.log(
      `deleting cache for chatHistory/getChat for user ${userId} and docs ${path.lang}/${path.page}`
    );
    await cache.delete(cacheKeyForPage(path, userId));
  }

  return {
    ...newChat,
    section: {
      sectionId,
      pagePath: `${path.lang}/${path.page}`,
    },
    messages: chatMessages,
    diff: chatDiffs,
  };
}

export type ChatWithMessages = Awaited<ReturnType<typeof addChat>>;

export async function getAllChat(
  path: PagePath,
  context: Context
): Promise<ChatWithMessages[]> {
  const { drizzle, userId } = context;
  if (!userId) {
    return [];
  }

  const chats = await drizzle.query.chat.findMany({
    where: and(
      eq(chat.userId, userId),
      exists(
        drizzle
          .select()
          .from(section)
          .where(
            and(
              eq(section.sectionId, chat.sectionId),
              eq(section.pagePath, `${path.lang}/${path.page}`)
            )
          )
      )
    ),
    with: {
      section: true,
      messages: {
        orderBy: [asc(message.createdAt)],
      },
      diff: true,
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
  // @ts-expect-error なぜかchatsの型にsectionとmessagesが含まれていないことになっているが、正しくwithを指定しているし、console.logしてみるとちゃんと含まれている
  return chats;
}

export async function getChatOne(chatId: string, context: Context) {
  const { drizzle, userId } = context;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  return (await drizzle.query.chat.findFirst({
    where: and(eq(chat.chatId, chatId), eq(chat.userId, userId)),
    with: {
      section: true,
      messages: {
        orderBy: [asc(message.createdAt)],
      },
      diff: {
        orderBy: [asc(diff.createdAt)],
      },
    },
  })) as typeof chat.$inferSelect & {
    section: typeof section.$inferSelect;
    messages: (typeof message.$inferSelect)[];
    diff: (typeof diff.$inferSelect)[];
  };
}

export async function migrateChatUser(oldUserId: string, newUserId: string) {
  const drizzle = await getDrizzle();
  await drizzle
    .update(chat)
    .set({ userId: newUserId })
    .where(eq(chat.userId, oldUserId));
}
