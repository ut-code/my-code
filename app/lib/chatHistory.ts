import { headers } from "next/headers";
import { getAuthServer } from "./auth";
import { getDrizzle } from "./drizzle";
import { chat, diff, message, section } from "@/schema/chat";
import { and, asc, eq, exists } from "drizzle-orm";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { isCloudflare } from "./detectCloudflare";
import {
  getRevisionOfMarkdownSection,
  LangId,
  MarkdownSection,
  PagePath,
  PageSlug,
  ReplacedRange,
  SectionId,
  SectionWithDiff,
} from "./docs";
import { dateReviver } from "./dateReviver";

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
export function cacheKeyForChat(chatId: string) {
  return `${CACHE_KEY_BASE}/getChatOne?chatId=${chatId}`;
}

// nextjsのキャッシュのrevalidateはRouteHandlerではなくServerActionから呼ばないと正しく動作しないらしい。
// https://github.com/vercel/next.js/issues/69064
// そのためlib/以下の関数では直接revalidateChatを呼ばず、ServerActionの関数から呼ぶようにする。
export async function revalidateChat(
  chatId: string,
  userId: string,
  pagePath: string | PagePath
) {
  if (typeof pagePath === "string") {
    const [lang, page] = pagePath.split("/") as [LangId, PageSlug];
    pagePath = { lang, page };
  }
  updateTag(cacheKeyForChat(chatId));
  updateTag(cacheKeyForPage(pagePath, userId));
  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    await cache.delete(cacheKeyForChat(chatId));
    await cache.delete(cacheKeyForPage(pagePath, userId));
  }
}

export interface Context {
  drizzle: Awaited<ReturnType<typeof getDrizzle>>;
  auth: Awaited<ReturnType<typeof getAuthServer>>;
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
  title: string,
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
      title,
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

  let chatDiffs;
  if (diffRaw.length > 0) {
    chatDiffs = await drizzle
      .insert(diff)
      .values(
        diffRaw.map((d) => ({
          chatId: newChat.chatId,
          ...d,
        }))
      )
      .returning();
  } else {
    chatDiffs = [] as never[];
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

/**
 * 既存のチャットにメッセージと差分を追加し、キャッシュを再検証する。
 * ストリーミング完了後に使用する。
 */
export async function addMessagesAndDiffs(
  chatId: string,
  path: PagePath,
  messages: CreateChatMessage[],
  diffRaw: CreateChatDiff[],
  context: Context
) {
  const { drizzle, userId } = context;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  await drizzle.insert(message).values(
    messages.map((msg) => ({
      chatId,
      role: msg.role,
      content: msg.content,
    }))
  );

  if (diffRaw.length > 0) {
    await drizzle.insert(diff).values(
      diffRaw.map((d) => ({
        chatId,
        ...d,
      }))
    );
  }
}

export async function deleteChat(chatId: string, context: Context) {
  const { drizzle, userId } = context;
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const deletedChat = await drizzle
    .delete(chat)
    .where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
    .returning();
  if (deletedChat.length === 0) {
    throw new Error("Chat not found or not authorized");
  }
  await drizzle.delete(message).where(eq(message.chatId, chatId));
  await drizzle.delete(diff).where(eq(diff.chatId, chatId));

  return deletedChat;
}

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

  const chatData = (await drizzle.query.chat.findFirst({
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
  })) as ChatWithMessages | undefined;

  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    await cache.put(
      cacheKeyForChat(chatId),
      new Response(JSON.stringify(chatData), {
        headers: { "Cache-Control": "max-age=86400, s-maxage=86400" },
      })
    );
  }

  return chatData;
}

export async function migrateChatUser(oldUserId: string, newUserId: string) {
  const drizzle = await getDrizzle();
  await drizzle
    .update(chat)
    .set({ userId: newUserId })
    .where(eq(chat.userId, oldUserId));
}

export async function updateDiffTargetMD5(
  diffId: string,
  targetMD5: string,
  context: Context
) {
  const { drizzle, userId } = context;
  if (!userId) {
    throw new Error("Not authenticated");
  }
  await drizzle
    .update(diff)
    .set({ targetMD5 })
    .where(eq(diff.id, diffId));
}

export function applySingleDiffToSection<T extends SectionWithDiff>(
  targetSection: T,
  diffItem: { search: string; replace: string; chatId: string }
): boolean {
  const startIndex = targetSection.replacedContent.indexOf(diffItem.search);
  if (startIndex === -1) {
    return false;
  }
  const endIndex = startIndex + diffItem.search.length;
  const replaceLen = diffItem.replace.length;
  const diffLen = replaceLen - diffItem.search.length; // 文字列長の増減分

  // 1. 文字列の置換
  targetSection.replacedContent =
    targetSection.replacedContent.slice(0, startIndex) +
    diffItem.replace +
    targetSection.replacedContent.slice(endIndex);

  // 2. 既存のハイライト範囲のズレを補正（今回の置換箇所より後ろにあるものをシフト）
  targetSection.replacedRange = targetSection.replacedRange.map((h) => {
    if (h.start >= endIndex) {
      // 完全に後ろにある場合は単純にシフト
      return {
        start: h.start + diffLen,
        end: h.end + diffLen,
        id: h.id,
      };
    }
    if (h.end >= endIndex) {
      return { start: h.start, end: h.end + diffLen, id: h.id };
    }
    return h;
  });

  // 3. 今回の置換箇所を新たなハイライト範囲として追加
  targetSection.replacedRange.push({
    start: startIndex,
    end: startIndex + replaceLen,
    id: diffItem.chatId,
  });

  return true;
}

export interface ApplyChatDiffOptions {
  fallbackToPastVersion?: boolean;
}

export async function applyChatDiff(
  splitMdContent: MarkdownSection[],
  chatHistories: ChatWithMessages[],
  options: ApplyChatDiffOptions = { fallbackToPastVersion: true }
): Promise<SectionWithDiff[]> {
  const fallbackToPastVersion = options.fallbackToPastVersion ?? true;

  const newContent: SectionWithDiff[] = splitMdContent.map((section) => ({
    ...section,
    replacedContent: section.rawContent,
    replacedRange: [] as ReplacedRange[],
    isOutdated: false,
    outdatedDiffsToUpdate: [],
  }));

  const chatDiffs = chatHistories.flatMap((chat) => chat.diff);
  chatDiffs.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const fallbackHandledSections = new Set<string>();

  for (const diffItem of chatDiffs) {
    const targetSection = newContent.find((s) => s.id === diffItem.sectionId);
    if (!targetSection) {
      console.error(
        `Failed to apply diff: section with id "${diffItem.sectionId}" not found`
      );
      continue;
    }

    if (fallbackHandledSections.has(targetSection.id)) {
      // すでに過去バージョンへのフォールバック時にこのセクションの全diffが再適用されている
      continue;
    }

    const success = applySingleDiffToSection(targetSection, diffItem);

    if (success) {
      // section.md5とtargetMD5が違うのにdiffの適用に成功したら、
      // それ以降も現在のバージョンを対象にすることができるので、diff.targetMD5を現在のバージョンに更新します。
      if (
        !targetSection.isOutdated &&
        targetSection.md5 &&
        diffItem.targetMD5 &&
        targetSection.md5 !== diffItem.targetMD5
      ) {
        if (!targetSection.outdatedDiffsToUpdate) {
          targetSection.outdatedDiffsToUpdate = [];
        }
        targetSection.outdatedDiffsToUpdate.push({
          chatId: diffItem.chatId,
          diffId: diffItem.id,
          targetMD5: targetSection.md5,
        });
      }
    } else {
      if (targetSection.md5 === diffItem.targetMD5) {
        // section.md5とtargetMD5が同じなのにdiffの適用に失敗したら、諦めます。
        console.error(
          `Failed to apply diff: search string "${diffItem.search}" not found in section ${targetSection.id}`
        );
      } else {
        // もしあるdiffの適用に失敗し、かつsection.md5とdiff.targetMD5が異なる場合、
        // targetMD5が指す当時のセクションをgetRevisionOfMarkdownSection()で取得し、
        // それに対してchatDiff全体を再度適用します。
        if (!fallbackToPastVersion) {
          console.error(
            `Failed to apply diff (fallback disabled): search string "${diffItem.search}" not found in section ${targetSection.id}`
          );
          continue;
        }

        try {
          const pastSection = await getRevisionOfMarkdownSection(
            targetSection.id as SectionId,
            diffItem.targetMD5
          );

          targetSection.isOutdated = true;
          targetSection.outdatedDiffsToUpdate = [];
          targetSection.replacedContent = pastSection.rawContent;
          targetSection.replacedRange = [];

          const sectionDiffs = chatDiffs.filter(
            (d) => d.sectionId === targetSection.id
          );
          for (const sDiff of sectionDiffs) {
            applySingleDiffToSection(targetSection, sDiff);
          }
          fallbackHandledSections.add(targetSection.id);
        } catch (error) {
          console.error(
            `Failed to fetch revision for section ${targetSection.id} (md5: ${diffItem.targetMD5}):`,
            error
          );
        }
      }
    }
  }

  return newContent;
}

/**
 * チャットの取得をキャッシュする。
 *
 * use cacheの仕様で、drizzleオブジェクトとauthオブジェクトは引数に渡せない。
 * 一方、use cacheの関数内でheaders()にはアクセスできない。
 * したがって、外でheaders()を使ってuserIdを取得した後、関数の中で再度drizzleを初期化しないといけない。
 *
 * docsとchatの2箇所のサーバーコンポーネントで使用。ServerActionやrouteではこれではなく直接getAllChat()を呼んだ方が確実なはずです。
 */
export async function getChatFromCache(path: PagePath, userId?: string) {
  "use cache";
  cacheLife("days");

  if (!userId) {
    return [];
  }
  cacheTag(cacheKeyForPage(path, userId));

  if (isCloudflare()) {
    const cache = await caches.open("chatHistory");
    const cachedResponse = await cache.match(cacheKeyForPage(path, userId));
    if (cachedResponse) {
      const data = JSON.parse(
        await cachedResponse.text(),
        dateReviver
      ) as ChatWithMessages[];
      return data;
    }
  }
  const ctx = await initContext({ userId });
  return await getAllChat(path, ctx);
}
