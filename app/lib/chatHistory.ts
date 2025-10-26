import { headers } from "next/headers";
import { auth } from "./auth";
import db from "./db";
import { chat, message } from "../../db/schema";
import { eq, and, asc } from "drizzle-orm";

export interface CreateChatMessage {
  role: "user" | "ai" | "error";
  content: string;
}

export async function addChat(
  docsId: string,
  sectionId: string,
  messages: CreateChatMessage[]
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not authenticated");
  }

  const [newChat] = await db
    .insert(chat)
    .values({
      userId: session.user.id,
      docsId,
      sectionId,
    })
    .returning();

  const chatMessages = await db
    .insert(message)
    .values(
      messages.map((msg) => ({
        chatId: newChat.chatId,
        role: msg.role,
        content: msg.content,
      }))
    )
    .returning();

  return {
    ...newChat,
    messages: chatMessages,
  };
}

export type ChatWithMessages = Awaited<ReturnType<typeof addChat>>;

export async function getChat(docsId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return [];
  }

  const chats = await db.query.chat.findMany({
    where: and(eq(chat.userId, session.user.id), eq(chat.docsId, docsId)),
    with: {
      messages: {
        orderBy: [asc(message.createdAt)],
      },
    },
    orderBy: [asc(chat.createdAt)],
  });

  return chats;
}

export async function migrateChatUser(oldUserId: string, newUserId: string) {
  await db
    .update(chat)
    .set({ userId: newUserId })
    .where(eq(chat.userId, oldUserId));
}
