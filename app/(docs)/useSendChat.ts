"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { captureException } from "@sentry/nextjs";
import { useEmbedContext } from "@/terminal/embedContext";
import { DynamicMarkdownSection, PagePath } from "@/lib/docs";
import { ChatStreamEvent } from "@/api/chat/route";
import { revalidateChatAction } from "@/actions/revalidateChat";
import { useStreamingChatContext } from "./streamingChatContext";
import {
  ReplCommand,
  ReplOutput,
} from "@my-code/runtime/interface";

export interface SendChatParams {
  path: PagePath;
  userQuestion: string;
  questionScope?: "page" | "language";
  sectionContent: DynamicMarkdownSection[];
  deleteChatOnCreated?: string;
  onSuccess?: () => void;
  replOutputs?: Record<string, ReplCommand[]>;
  files?: Record<string, string>;
  execResults?: Record<string, ReplOutput[]>;
}

/**
 * チャットの作成・既存チャットの再生成で使う、クライアント側のチャットストリーミング描画・revalidate・ルーティングの関数
 */
export function useSendChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { files, replOutputs, execResults } = useEmbedContext();
  const router = useRouter();
  const streamingChatContext = useStreamingChatContext();

  const sendChat = useCallback(
    async ({
      path,
      userQuestion,
      questionScope = "page",
      sectionContent,
      deleteChatOnCreated,
      onSuccess,
      replOutputs: customReplOutputs,
      files: customFiles,
      execResults: customExecResults,
    }: SendChatParams) => {
      if (!userQuestion) return;

      setIsLoading(true);
      setErrorMessage(null);

      let response: Response;
      try {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path,
            userQuestion,
            questionScope,
            sectionContent,
            replOutputs: customReplOutputs ?? replOutputs,
            files: customFiles ?? files,
            execResults: customExecResults ?? execResults,
            deleteChatOnCreated,
          }),
        });
      } catch (e) {
        captureException(e);
        setErrorMessage("AIへの接続に失敗しました");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorMessage(`エラーが発生しました (${response.status})`);
        setIsLoading(false);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let chatId: string | null = null;
      let chatPagePath: string | PagePath = path;
      let navigated = false;

      void (async () => {
        try {
          while (true) {
            const result = await reader.read();
            const { done, value } = result;
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const event = JSON.parse(line) as ChatStreamEvent;

                if (event.type === "chat") {
                  chatPagePath = event.pagePath;
                  chatId = event.chatId;

                  // 1. ストリーミング描画の開始
                  streamingChatContext.startStreaming(event.chatId);

                  // 2. 新チャットの再検証
                  await revalidateChatAction(event.chatId, event.pagePath);
                  if (deleteChatOnCreated) {
                    await revalidateChatAction(deleteChatOnCreated, event.pagePath);
                  }

                  // 3. セクションのスクロール
                  if (event.pagePath === `${path.lang}/${path.page}`) {
                    document.getElementById(event.sectionId)?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }

                  // 5. 新チャット画面へのルーティング & 更新
                  router.push(`/chat/${event.chatId}`, {
                    scroll: false,
                  });
                  router.refresh();

                  navigated = true;
                  setIsLoading(false);
                  onSuccess?.();
                } else if (event.type === "chunk") {
                  streamingChatContext.appendChunk(event.text);
                } else if (event.type === "done") {
                  if (chatId) {
                    await revalidateChatAction(chatId, chatPagePath);
                  }
                  if (deleteChatOnCreated) {
                    await revalidateChatAction(deleteChatOnCreated, chatPagePath);
                  }
                  streamingChatContext.finishStreaming();
                  router.refresh();
                } else if (event.type === "error") {
                  if (!navigated) {
                    setErrorMessage(event.message);
                    setIsLoading(false);
                  }
                  if (chatId) {
                    await revalidateChatAction(chatId, chatPagePath);
                  }
                  streamingChatContext.finishStreaming();
                  router.refresh();
                }
              } catch (e) {
                captureException(e);
              }
            }
          }
        } catch (err) {
          captureException(err);
          console.error("Stream reading failed:", err);
          if (!navigated) {
            setErrorMessage(String(err));
            setIsLoading(false);
          }
          streamingChatContext.finishStreaming();
        }
      })();
    },
    [
      execResults,
      files,
      replOutputs,
      router,
      streamingChatContext,
    ]
  );

  return {
    sendChat,
    isLoading,
    errorMessage,
    setErrorMessage,
  };
}
