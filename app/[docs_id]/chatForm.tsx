"use client";

import { useState, FormEvent, useEffect } from "react";
import useSWR from "swr";
import {
  getQuestionExample,
  QuestionExampleParams,
} from "../actions/questionExample";
import { getLanguageName } from "../pagesList";
import { DynamicMarkdownSection } from "./pageContent";
import { useEmbedContext } from "../terminal/embedContext";
import { useChatHistoryContext } from "./chatHistory";
import { askAI } from "@/actions/chatActions";

interface ChatFormProps {
  docs_id: string;
  documentContent: string;
  sectionContent: DynamicMarkdownSection[];
  close: () => void;
}

export function ChatForm({
  docs_id,
  documentContent,
  sectionContent,
  close,
}: ChatFormProps) {
  // const [messages, updateChatHistory] = useChatHistory(sectionId);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { addChat } = useChatHistoryContext();

  const lang = getLanguageName(docs_id);

  const { files, replOutputs, execResults } = useEmbedContext();

  const documentContentInView = sectionContent
    .filter((s) => s.inView)
    .map((s) => s.rawContent)
    .join("\n\n");
  const { data: exampleData, error: exampleError } = useSWR(
    // 質問フォームを開いたときだけで良い
    {
      lang,
      documentContent: documentContentInView,
    } satisfies QuestionExampleParams,
    getQuestionExample,
    {
      // リクエストは古くても構わないので1回でいい
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (exampleError) {
    console.error("Error getting question example:", exampleError);
  }
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
    setErrorMessage(null); // Clear previous error message

    let userQuestion = inputValue;
    if (!userQuestion && exampleData) {
      // 質問が空欄なら、質問例を使用
      userQuestion =
        exampleData[Math.floor(exampleChoice * exampleData.length)];
      setInputValue(userQuestion);
    }

    const result = await askAI({
      userQuestion,
      docsId: docs_id,
      documentContent,
      sectionContent,
      replOutputs,
      files,
      execResults,
    });

    if (result.error !== null) {
      setErrorMessage(result.error);
      console.log(result.error);
    } else {
      addChat(result.chat);
      // TODO: chatIdが指す対象の回答にフォーカス
      setInputValue("");
      close();
    }

    setIsLoading(false);
  };

  return (
    <form
      className="border border-2 border-secondary shadow-lg rounded-box bg-base-100"
      style={{
        width: "100%",
        textAlign: "center",
      }}
      onSubmit={handleSubmit}
    >
      <textarea
        className="textarea textarea-ghost textarea-md rounded-box"
        placeholder={
          "質問を入力してください" +
          (exampleData
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
