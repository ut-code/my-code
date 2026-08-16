import { NextRequest } from "next/server";
import {
  applyChatDiff,
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
  replOutputs: z
    .record(z.string(), z.array(ReplCommandSchema))
    .optional()
    .default({}),
  files: z.record(z.string(), z.string()).optional().default({}),
  execResults: z
    .record(z.string(), z.array(ReplOutputSchema))
    .optional()
    .default({}),
});

export type RegenerateStreamEvent =
  | { type: "progress"; current: number; total: number }
  | { type: "done"; deletedChatIds: string[]; createdChatIds: string[] }
  | { type: "error"; message: string };

/**
 * そのセクションの全chatを作成日順に再作成&削除します。
 * 
 * 既存のchatのdiffを無視して最新のcontentを渡して1つ目のchatを生成
 *   →そのdiffを適用したcontentに対して2つ目のchatを作成
 *   →その2つのdiffを適用したcontentに対して3つ目のchat...
 * というように順番に作成する必要があります。
 */
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

        const targetChatIds = new Set(targetChats.map((c) => c.chatId));
        const nonTargetChats = chatHistories.filter(
          (c) => !targetChatIds.has(c.chatId)
        );

        const baseSections = await applyChatDiff(rawSections, nonTargetChats, {
          fallbackToPastVersion: false,
        });

        const currentSectionContent: DynamicMarkdownSection[] = baseSections.map(
          (s) => ({
            ...s,
            inView: false,
          })
        );

        const deletedChatIds: string[] = [];
        const createdChatIds: string[] = [];

        for (let i = 0; i < targetChats.length; i++) {
          const oldChat = targetChats[i];
          send({ type: "progress", current: i, total: targetChats.length });

          try {
            const firstUserMsg = oldChat.messages.find((m) => m.role === "user");
            const userQuestion = firstUserMsg ? firstUserMsg.content : oldChat.title;

            // 1. Generate new chat on server
            const result = await generateSingleChat({
              path,
              userQuestion,
              sectionContent: currentSectionContent,
              replOutputs: oldChat.replOutputs ?? replOutputs ?? {},
              files: oldChat.files ?? files ?? {},
              execResults: oldChat.execResults ?? execResults ?? {},
              context,
            });
            createdChatIds.push(result.chatId);

            // 2. Delete old chat from DB
            await deleteChat(oldChat.chatId, context);
            deletedChatIds.push(oldChat.chatId);

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
          } catch (err) {
            captureException(err);
            console.error(`Failed to regenerate chat ${oldChat.chatId}:`, err);
          }
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
