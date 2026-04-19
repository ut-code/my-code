"use server";

import { initContext, revalidateChat } from "@/lib/chatHistory";
import { PagePath, PagePathSchema } from "@/lib/docs";
import { setExtra, withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";
import { z } from "zod";

export async function revalidateChatAction(
  chatId: string,
  pagePath: string | PagePath
) {
  return withServerActionInstrumentation(
    "revalidateChatAction", // Action name for Sentry
    {
      headers: await headers(), // Connect client and server traces
      recordResponse: true, // Include response data
    },
    async () => {
      setExtra("args", { chatId, pagePath });

      chatId = z.uuid().parse(chatId);
      if (typeof pagePath === "string") {
        if (!/^[a-z0-9_-]+\/[a-z0-9_-]+$/.test(pagePath)) {
          throw new Error("Invalid pagePath format");
        }
        const [lang, page] = pagePath.split("/");
        pagePath = PagePathSchema.parse({ lang, page });
      } else {
        pagePath = PagePathSchema.parse(pagePath);
      }
      const ctx = await initContext();
      if (!ctx.userId) {
        throw new Error("Not authenticated");
      }
      await revalidateChat(chatId, ctx.userId, pagePath);
    }
  );
}
