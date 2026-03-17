"use client";

import { useState, FormEvent, useEffect } from "react";
// import useSWR from "swr";
// import {
//   getQuestionExample,
//   QuestionExampleParams,
// } from "../actions/questionExample";
// import { getLanguageName } from "../pagesList";
import { DynamicMarkdownSection } from "./pageContent";
import { useEmbedContext } from "@/terminal/embedContext";
import { PagePath } from "@/lib/docs";
import { useRouter } from "next/navigation";
import { useStreamingChat } from "@/(docs)/streamingChatContext";

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

  // const lang = getLanguageName(docs_id);

  const { files, replOutputs, execResults } = useEmbedContext();

  const router = useRouter();
  const streamingChat = useStreamingChat();

  // const documentContentInView = sectionContent
  //   .filter((s) => s.inView)
  //   .map((s) => s.rawContent)
  //   .join("\n\n");
  // const { data: exampleData, error: exampleError } = useSWR(
  //   // 質問フォームを開いたときだけで良い
  //   {
  //     lang,
  //     documentContent: documentContentInView,
  //   } satisfies QuestionExampleParams,
  //   getQuestionExample,
  //   {
  //     // リクエストは古くても構わないので1回でいい
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //   }
  // );
  // if (exampleError) {
  //   console.error("Error getting question example:", exampleError);
  // }
  // 質問フォームを開くたびにランダムに選び直し、
  // exampleData[Math.floor(exampleChoice * exampleData.length)] を採用する
  const [exampleChoice, setExampleChoice] = useState<number>(0); // 0〜1
  useEffect(() => {
    if (exampleChoice === 0) {
      setExampleChoice(Math.random());
    }
  }, [exampleChoice]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const userQuestion = inputValue;

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
    let navigated = false;

    // ストリームを非同期で読み続ける（ナビゲーション後もバックグラウンドで継続）
    const readStream = async () => {
      while (true) {
        let result: ReadableStreamReadResult<Uint8Array>;
        try {
          result = await reader.read();
        } catch (err) {
          console.error("Stream connection interrupted:", err);
          break;
        }
        const { done, value } = result;
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as
              | { type: "chat"; chatId: string; sectionId: string }
              | { type: "chunk"; text: string }
              | { type: "done" }
              | { type: "error"; message: string };

            if (event.type === "chat") {
              streamingChat.startStreaming(event.chatId, userQuestion);
              document.getElementById(event.sectionId)?.scrollIntoView({
                behavior: "smooth",
              });
              router.push(`/chat/${event.chatId}`, { scroll: false });
              navigated = true;
              setIsLoading(false);
              setInputValue("");
              close();
            } else if (event.type === "chunk") {
              streamingChat.appendChunk(event.text);
            } else if (event.type === "done") {
              streamingChat.finishStreaming();
            } else if (event.type === "error") {
              if (!navigated) {
                setErrorMessage(event.message);
                setIsLoading(false);
              }
              streamingChat.finishStreaming();
            }
          } catch {
            // ignore JSON parse errors
          }
        }
      }
    };

    // ストリーム読み込みはバックグラウンドで継続（awaitしない）
    readStream().catch((err) => {
      console.error("Stream reading failed:", err);
      // ナビゲーション後のエラーはストリーミングを終了してローディングを止める
      streamingChat.finishStreaming();
    });
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
          "質問を入力してください" /* +
          (exampleData
            ? ` (例:「${exampleData[Math.floor(exampleChoice * exampleData.length)]}」)`
            : "")*/
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
