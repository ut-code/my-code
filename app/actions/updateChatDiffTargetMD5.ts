"use server";

import { initContext, revalidateChat, updateDiffTargetMD5 } from "@/lib/chatHistory";
import { PagePath, PagePathSchema } from "@/lib/docs";
import { setExtra, withServerActionInstrumentation } from "@sentry/nextjs";
import { headers } from "next/headers";
import { z } from "zod";

export async function updateChatDiffTargetMD5Action(
  chatId: string,
  diffId: string,
  targetMD5: string,
  pagePath: string | PagePath
) {
  return withServerActionInstrumentation(
    "updateChatDiffTargetMD5Action",
    {
      headers: await headers(),
      recordResponse: true,
    },
    async () => {
      setExtra("args", { chatId, diffId, targetMD5, pagePath });
      chatId = z.uuid().parse(chatId);
      diffId = z.uuid().parse(diffId);
      targetMD5 = z.string().parse(targetMD5);

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

      await updateDiffTargetMD5(diffId, targetMD5, ctx);
      await revalidateChat(chatId, ctx.userId, pagePath);
    }
  );
}
