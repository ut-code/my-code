import { NextRequest } from "next/server";
import { generateContentStream } from "@/lib/ai";
import {
  addChat,
  addMessagesAndDiffs,
  deleteChat,
  initContext,
  revalidateChatOnDemand,
} from "@/lib/chatHistory";
import {
  DynamicMarkdownSectionSchema,
  getMarkdownSections,
  getPagesListForLang,
  introSectionId,
  PagePathSchema,
  PageSlug,
  SectionId,
} from "@/lib/docs";
import {
  buildChatPrompt,
  buildRoutePrompt,
  parseDiffsAndCleanMessage,
} from "@/lib/chatGenerator";
import {
  ReplCommandSchema,
  ReplOutputSchema,
} from "@my-code/runtime/interface";
import { z } from "zod";
import { captureException } from "@sentry/nextjs";

const ChatParamsSchema = z.object({
  path: PagePathSchema,
  userQuestion: z.string().min(1),
  questionScope: z.enum(["page", "language"]).default("page"),
  sectionContent: z.array(DynamicMarkdownSectionSchema),
  deleteChatOnCreated: z.string().optional(),
  replOutputs: z.record(z.string(), z.array(ReplCommandSchema)),
  files: z.record(z.string(), z.string()),
  execResults: z.record(z.string(), z.array(ReplOutputSchema)),
});

export type ChatStreamEvent =
  | { type: "chat"; chatId: string; sectionId: string; pagePath: string }
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export async function POST(request: NextRequest) {
  const context = await initContext();
  if (!context.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const parseResult = ChatParamsSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return new Response(JSON.stringify(parseResult.error), { status: 400 });
  }
  const {
    path,
    userQuestion,
    questionScope,
    sectionContent,
    deleteChatOnCreated,
    replOutputs,
    files,
    execResults,
  } = parseResult.data;

  const langEntry = await getPagesListForLang(path.lang);
  const langName = langEntry?.name ?? path.lang;
  let targetPath = path;
  let targetSectionContent = sectionContent;

  if (questionScope === "language" && langEntry) {
    const routePrompt = await buildRoutePrompt({
      lang: path.lang,
      langName,
      pages: langEntry.pages,
      userQuestion,
    });

    let routeResult = "";
    for await (const chunk of generateContentStream(
      userQuestion,
      routePrompt.join("\n")
    )) {
      routeResult += chunk;
    }
    const selectedPageSlug = routeResult
      .trim()
      .split(/\s+/)[0]
      ?.replace(/^slug:/i, "")
      .replace(/^["'`]+|["'`.,:;]+$/g, "")
      .trim() as typeof path.page | undefined;
    if (
      selectedPageSlug &&
      langEntry.pages.some((page) => page.slug === selectedPageSlug)
    ) {
      targetPath = {
        lang: path.lang,
        page: selectedPageSlug,
      };
      const routedSections = await getMarkdownSections(
        targetPath.lang,
        targetPath.page
      );
      targetSectionContent = routedSections.map((section) => ({
        ...section,
        inView: false,
        replacedContent: section.rawContent,
        replacedRange: [],
      }));
    }
  }

  const isSandbox = path.page === ("sandbox" as PageSlug);

  const prompt = await buildChatPrompt({
    path: targetPath,
    targetSectionContent,
    replOutputs,
    files,
    execResults,
    langName,
  });

  console.log(prompt);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: ChatStreamEvent) {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      }
      let fullText = "";

      try {
        let headerParsed = false;
        let chatId: string | undefined;
        let contentAfterHeader = "";

        for await (const chunk of generateContentStream(
          userQuestion,
          prompt.join("\n")
        )) {
          console.log("Received chunk:", [chunk]);

          fullText += chunk;

          if (!headerParsed) {
            // Wait until we have at least 2 lines (sectionId + title + start of body)
            const headerMatch = fullText.match(/^([^\n]+?)\n+([^\n]+?)\n+/);
            if (headerMatch) {
              headerParsed = true;
              let targetSectionId = isSandbox
                ? ("sandbox" as SectionId)
                : (headerMatch[1].trim() as SectionId);
              const title = headerMatch[2].trim();

              if (
                !isSandbox &&
                (!targetSectionId ||
                  !targetSectionContent.some((s) => s.id === targetSectionId))
              ) {
                targetSectionId = introSectionId(targetPath);
              }

              if (!title) {
                send({
                  type: "error",
                  message: "AIからの応答にタイトルが含まれていませんでした",
                });
                captureException(
                  "AIからの応答にタイトルが含まれていませんでした",
                  {
                    extra: {
                      prompt,
                      fullText,
                    },
                  }
                );
                controller.close();
                return;
              }

              // Create chat record in DB immediately
              const newChat = await addChat(
                targetPath,
                targetSectionId,
                title,
                [{ role: "user", content: userQuestion }],
                [],
                context,
                {
                  replOutputs,
                  files,
                  execResults,
                }
              );
              chatId = newChat.chatId;

              // Notify client with chatId so navigation can happen
              send({
                type: "chat",
                chatId,
                sectionId: targetSectionId,
                pagePath: `${targetPath.lang}/${targetPath.page}`,
              });

              // Send any content that came after the header in this chunk
              contentAfterHeader = fullText.slice(headerMatch[0].length);
              if (contentAfterHeader) {
                send({ type: "chunk", text: contentAfterHeader });
              }
            }
          } else {
            // Header already parsed - stream the chunk directly
            contentAfterHeader += chunk;
            send({ type: "chunk", text: chunk });
          }
        }

        // AI response finished
        if (!chatId) {
          // Header was never parsed (e.g. very short response without 2 newlines)
          send({
            type: "error",
            message: "AIからの応答の形式が正しくありませんでした",
          });
          captureException("AIからの応答の形式が正しくありませんでした", {
            extra: {
              prompt,
              fullText,
            },
          });
          controller.close();
          return;
        }

        // Parse diffs from the full body content
        const { diffRaw, cleanMessage } = parseDiffsAndCleanMessage(
          contentAfterHeader,
          targetSectionContent
        );

        // Save messages and diffs to DB
        await addMessagesAndDiffs(
          chatId,
          targetPath,
          [{ role: "ai", content: cleanMessage }],
          diffRaw,
          context
        );

        if (deleteChatOnCreated) {
          try {
            await deleteChat(deleteChatOnCreated, context);
          } catch (e) {
            console.error(
              `Failed to delete old chat ${deleteChatOnCreated}:`,
              e
            );
          }
        }

        // クライアントでもrevalidateChatActionを呼ぶが、一応こちらでもrevalidateしておく
        if (deleteChatOnCreated) {
          await revalidateChatOnDemand(
            deleteChatOnCreated,
            context.userId!,
            path
          );
        }
        await revalidateChatOnDemand(chatId, context.userId!, path);

        send({ type: "done" });
        controller.close();
      } catch (error: unknown) {
        captureException(error, { extra: { prompt, fullText } });
        console.error("Error in AI streaming:", error);
        try {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: "error", message: String(error) }) + "\n"
            )
          );
        } catch {
          // controller might already be closed
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
