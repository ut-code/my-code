"use server";

import { getChatOne, initContext } from "@/lib/chatHistory";
import { setExtra, withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";
import { z } from "zod";

export async function getChatOneAction(chatId: string) {
  return withServerActionInstrumentation(
    "getChatOneAction",
    {
      headers: await headers(),
      recordResponse: true,
    },
    async () => {
      setExtra("args", { chatId });
      chatId = z.uuid().parse(chatId);
      const ctx = await initContext();
      if (!ctx.userId) {
        throw new Error("Not authenticated");
      }
      return await getChatOne(chatId, ctx);
    }
  );
}
