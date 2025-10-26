import { headers } from "next/headers";
import { getAuthServer } from "./auth";
import { getDrizzle } from "./drizzle";
import { chat, message } from "@/schema/chat";
import { and, asc, eq } from "drizzle-orm";

export interface CreateChatMessage {
  role: "user" | "ai" | "error";
  content: string;
}

export async function addChat(
  docsId: string,
  sectionId: string,
  messages: CreateChatMessage[]
) {
  const drizzle = await getDrizzle();
  const auth = await getAuthServer(drizzle);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not authenticated");
  }

  const [newChat] = await drizzle
    .insert(chat)
    .values({
      userId: session.user.id,
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

  return {
    ...newChat,
    messages: chatMessages,
  };
}

export type ChatWithMessages = Awaited<ReturnType<typeof addChat>>;

export async function getChat(docsId: string) {
  const drizzle = await getDrizzle();
  const auth = await getAuthServer(drizzle);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return [];
  }

  const chats = await drizzle.query.chat.findMany({
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
  const drizzle = await getDrizzle();
  await drizzle
    .update(chat)
    .set({ userId: newUserId })
    .where(eq(chat.userId, oldUserId));
}
