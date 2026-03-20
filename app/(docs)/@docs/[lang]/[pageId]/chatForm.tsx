"use client";

import { useState, FormEvent, useEffect, useRef, useCallback, useMemo } from "react";
// import useSWR from "swr";
// import {
//   getQuestionExample,
//   QuestionExampleParams,
// } from "../actions/questionExample";
// import { getLanguageName } from "../pagesList";
import { useEmbedContext } from "@/terminal/embedContext";
import { DynamicMarkdownSection, PagePath } from "@/lib/docs";
import { usePathname, useRouter } from "next/navigation";
import { ChatStreamEvent } from "@/api/chat/route";
import { useStreamingChatContext } from "@/(docs)/streamingChatContext";
import { revalidateChatAction } from "@/actions/revalidateChat";

interface ChatFormProps {
  path: PagePath;
  sectionContent: DynamicMarkdownSection[];
  close: () => void;
}

export function ChatForm({ path, sectionContent, close }: ChatFormProps) {
  // const [messages, updateChatHistory] = useChatHistory(sectionId);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { files, replOutputs, execResults } = useEmbedContext();

  const router = useRouter();
  const streamingChatContext = useStreamingChatContext();

  const pathname = usePathname();
  const pendingRouterPushTarget = useRef<null | string>(null);
  const pendingRouterPushResolver = useRef<null | (() => void)>(null);
  // router.pushの完了を待つ関数。pathnameの変化でページ遷移の完了を検知し、解決する。
  const asyncRouterPush = useCallback(
    (url: string, options?: { scroll?: boolean }) => {
      if (pendingRouterPushTarget.current) {
        console.error(
          "Already navigating to",
          pendingRouterPushTarget.current,
          "can't navigate to",
          url
        );
        return;
      }
      pendingRouterPushTarget.current = url;
      return new Promise<void>((resolve) => {
        pendingRouterPushResolver.current = resolve;
        router.push(url, options);
      });
    },
    [router]
  );
  useEffect(() => {
    if (pendingRouterPushTarget.current === pathname) {
      pendingRouterPushResolver.current?.();
      pendingRouterPushTarget.current = null;
      pendingRouterPushResolver.current = null;
    }
  }, [pathname]);

  const exampleData = useMemo(
    () =>
      sectionContent
        .filter((s) => s.inView)
        .map((s) => s.question)
        .filter((qe) => qe !== undefined)
        .flat(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // 質問フォームを開くたびにランダムに選び直し、
  // exampleData[Math.floor(exampleChoice * exampleData.length)] を採用する
  const [exampleChoice, setExampleChoice] = useState<number | undefined>(
    undefined
  ); // 0〜1
  useEffect(() => {
    if (exampleChoice === undefined) {
      setExampleChoice(Math.random());
    }
  }, [exampleChoice]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    let userQuestion = inputValue;
    if (!userQuestion && exampleData.length > 0 && exampleChoice) {
      // 質問が空欄なら、質問例を使用
      userQuestion =
        exampleData[Math.floor(exampleChoice * exampleData.length)];
      setInputValue(userQuestion);
    }
    if (!userQuestion) {
      return;
    }

    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Clear previous error message

    let response: Response;
    try {
      response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          userQuestion,
          sectionContent,
          replOutputs,
          files,
          execResults,
        }),
      });
    } catch {
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
    let navigated = false;

    // ストリームを非同期で読み続ける（ナビゲーション後もバックグラウンドで継続）
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
                // revalidateChatは/api/chatの中では呼ばず、別のServerActionとして呼び出す
                await revalidateChatAction(event.chatId, path);
                chatId = event.chatId;
                streamingChatContext.startStreaming(event.chatId);
                document.getElementById(event.sectionId)?.scrollIntoView({
                  behavior: "smooth",
                });
                await asyncRouterPush(`/chat/${event.chatId}`, {
                  scroll: false,
                });
                router.refresh();
                navigated = true;
                setIsLoading(false);
                setInputValue("");
                close();
              } else if (event.type === "chunk") {
                streamingChatContext.appendChunk(event.text);
              } else if (event.type === "done") {
                if (chatId) {
                  await revalidateChatAction(chatId, path);
                }
                streamingChatContext.finishStreaming();
                router.refresh();
              } else if (event.type === "error") {
                if (!navigated) {
                  setErrorMessage(event.message);
                  setIsLoading(false);
                }
                if (chatId) {
                  await revalidateChatAction(chatId, path);
                }
                streamingChatContext.finishStreaming();
                router.refresh();
              }
            } catch {
              // ignore JSON parse errors
            }
          }
        }
      } catch (err) {
        console.error("Stream reading failed:", err);
        // ナビゲーション後のエラーはストリーミングを終了してローディングを止める
        if (!navigated) {
          setErrorMessage(String(err));
          setIsLoading(false);
        }
        streamingChatContext.finishStreaming();
      }
    })();
  };

  return (
    <form
      className="border border-2 border-secondary shadow-lg rounded-box bg-base-100/60 backdrop-blur-xs"
      style={{
        width: "100%",
        textAlign: "center",
      }}
      onSubmit={handleSubmit}
    >
      <textarea
        className="textarea textarea-ghost textarea-md rounded-box bg-transparent!"
        placeholder={
          "質問を入力してください" +
          (exampleData.length > 0 && exampleChoice !== undefined
            ? ` (例:「${exampleData[Math.floor(exampleChoice * exampleData.length)]}」)`
            : "")
        }
        style={{
          width: "100%",
          height: "110px",
          resize: "none",
          outlineStyle: "none",
        }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      ></textarea>
      <div
        style={{
          margin: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          className="btn btn-soft btn-primary rounded-full"
          onClick={close}
          type="button"
        >
          閉じる
        </button>
        {errorMessage && (
          <div
            className="text-error text-left text-nowrap overflow-hidden text-ellipsis"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              flex: 1,
            }}
          >
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          className="btn btn-soft btn-circle btn-secondary"
          title="送信"
          disabled={isLoading}
        >
          <span className="icon">➤</span>
        </button>
      </div>
    </form>
  );
}
