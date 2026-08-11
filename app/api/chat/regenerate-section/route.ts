import { NextRequest } from "next/server";
import {
  applySingleDiffToSection,
  deleteChat,
  getAllChat,
  initContext,
  revalidateChatOnDemand,
} from "@/lib/chatHistory";
import {
  DynamicMarkdownSection,
  getMarkdownSections,
  PagePathSchema,
} from "@/lib/docs";
import { generateSingleChat } from "@/lib/chatGenerator";
import {
  ReplCommandSchema,
  ReplOutputSchema,
} from "@my-code/runtime/interface";
import { z } from "zod";
import { captureException } from "@sentry/nextjs";

const RegenerateSectionSchema = z.object({
  path: PagePathSchema,
  sectionId: z.string(),
  replOutputs: z.record(z.string(), z.array(ReplCommandSchema)),
  files: z.record(z.string(), z.string()),
  execResults: z.record(z.string(), z.array(ReplOutputSchema)),
});

export type RegenerateStreamEvent =
  | { type: "progress"; current: number; total: number }
  | { type: "done"; deletedChatIds: string[]; createdChatIds: string[] }
  | { type: "error"; message: string };

export async function POST(request: NextRequest) {
  const context = await initContext();
  if (!context.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const parseResult = RegenerateSectionSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return new Response(JSON.stringify(parseResult.error), { status: 400 });
  }
  const { path, sectionId, replOutputs, files, execResults } = parseResult.data;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: RegenerateStreamEvent) {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      }

      try {
        const rawSections = await getMarkdownSections(path.lang, path.page);
        const chatHistories = await getAllChat(path, context);

        const targetChats = chatHistories.filter(
          (c) =>
            c.sectionId === sectionId ||
            (rawSections[0]?.id === sectionId &&
              rawSections.every((sec) => c.sectionId !== sec.id))
        );

        targetChats.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        if (targetChats.length === 0) {
          send({ type: "done", deletedChatIds: [], createdChatIds: [] });
          controller.close();
          return;
        }

        const currentSectionContent: DynamicMarkdownSection[] = rawSections.map(
          (s) => ({
            ...s,
            inView: false,
            replacedContent: s.rawContent,
            replacedRange: [],
            isOutdated: false,
          })
        );

        const deletedChatIds: string[] = [];
        const createdChatIds: string[] = [];

        for (let i = 0; i < targetChats.length; i++) {
          const oldChat = targetChats[i];
          deletedChatIds.push(oldChat.chatId);
          send({ type: "progress", current: i, total: targetChats.length });

          const firstUserMsg = oldChat.messages.find((m) => m.role === "user");
          const userQuestion = firstUserMsg ? firstUserMsg.content : oldChat.title;

          // 1. Generate new chat on server
          const result = await generateSingleChat({
            path,
            userQuestion,
            sectionContent: currentSectionContent,
            replOutputs,
            files,
            execResults,
            context,
          });
          createdChatIds.push(result.chatId);

          // 2. Delete old chat from DB
          await deleteChat(oldChat.chatId, context);

          // 3. Apply newly generated diffs to currentSectionContent on server
          for (const d of result.diffRaw) {
            const targetSec = currentSectionContent.find(
              (sec) => sec.id === d.sectionId
            );
            if (targetSec) {
              applySingleDiffToSection(targetSec, {
                search: d.search,
                replace: d.replace,
                chatId: result.chatId,
              });
            }
          }

          // クライアントでもrevalidateChatActionを呼ぶが、一応こちらでもrevalidateしておく
          await revalidateChatOnDemand(oldChat.chatId, context.userId!, path);
          await revalidateChatOnDemand(result.chatId, context.userId!, path);
        }

        send({ type: "done", deletedChatIds, createdChatIds });
        controller.close();
      } catch (error: unknown) {
        captureException(error);
        console.error("Error in section regeneration:", error);
        try {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: "error", message: String(error) }) + "\n"
            )
          );
        } catch {
          // ignore
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    },
  });
}
