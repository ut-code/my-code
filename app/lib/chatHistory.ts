import { headers } from "next/headers";
import { getAuthServer } from "./auth";

export interface CreateChatMessage {
  role: "user" | "ai" | "error";
  content: string;
}

export async function addChat(
  docsId: string,
  sectionId: string,
  messages: CreateChatMessage[]
) {
  const prisma = await getPrismaClient();
  const auth = await getAuthServer(prisma);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not authenticated");
  }

  return await prisma.chat.create({
    data: {
      userId: session.user.id,
      docsId,
      sectionId,
      messages: {
        createMany: {
          data: messages,
        },
      },
    },
    include: {
      messages: true,
    },
  });
}

export type ChatWithMessages = Awaited<ReturnType<typeof addChat>>;

export async function getChat(docsId: string) {
  const prisma = await getPrismaClient();
  const auth = await getAuthServer(prisma);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return [];
  }

  return await prisma.chat.findMany({
    where: {
      userId: session.user.id,
      docsId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function migrateChatUser(oldUserId: string, newUserId: string) {
  const prisma = await getPrismaClient();
  await prisma.chat.updateMany({
    where: {
      userId: oldUserId,
    },
    data: {
      userId: newUserId,
    },
  });
}
