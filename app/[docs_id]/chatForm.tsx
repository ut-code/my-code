"use client";

import { useState, FormEvent, useEffect } from "react";
import { askAI } from "@/app/actions/chatActions";
import { type Message } from "../hooks/useChathistory";
import useSWR from "swr";
import { getQuestionExample } from "../actions/questionExample";
import { getLanguageName } from "../pagesList";
import { DynamicMarkdownSection } from "./pageContent";
import { useEmbedContext } from "../terminal/embedContext";

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

  const lang = getLanguageName(docs_id);

  const { files, replOutputs, execResults } = useEmbedContext();

  const documentContentInView = sectionContent
    .filter((s) => s.inView)
    .map((s) => s.rawContent)
    .join("\n\n");
  const { data: exampleData, error: exampleError } = useSWR(
    // 質問フォームを開いたときだけで良い
    { lang, documentContentInView },
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

    // const userMessage: Message = { sender: "user", text: inputValue };
    // updateChatHistory([userMessage]);

    let userQuestion = inputValue;
    if (!userQuestion && exampleData) {
      // 質問が空欄なら、質問例を使用
      userQuestion =
        exampleData[Math.floor(exampleChoice * exampleData.length)];
      setInputValue(userQuestion);
    }

    const result = await askAI({
      userQuestion,
      documentContent,
      sectionContent,
      replOutputs,
      files,
      execResults,
    });

    if (result.error) {
      const errorMessage: Message = {
        sender: "ai",
        text: `エラー: ${result.error}`,
        isError: true,
      };
      // updateChatHistory([userMessage, errorMessage]);
    } else {
      const aiMessage: Message = { sender: "ai", text: result.response };
      console.log(aiMessage);
      // updateChatHistory([userMessage, aiMessage]);
      setInputValue("");
    }

    setIsLoading(false);
  };

  return (
    <form
      className="border border-2 border-secondary shadow-lg rounded-lg bg-base-100"
      style={{
        width: "100%",
        textAlign: "center",
      }}
      onSubmit={handleSubmit}
    >
      <div className="input-area">
        <textarea
          className="textarea textarea-ghost textarea-md rounded-lg"
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
      </div>
      <div
        className="controls"
        style={{
          margin: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="left-icons">
          <button
            className="btn btn-soft btn-secondary rounded-full"
            onClick={close}
            type="button"
          >
            閉じる
          </button>
        </div>
        <div className="right-controls">
          <button
            type="submit"
            className="btn btn-soft btn-circle btn-accent border-2 border-accent rounded-full"
            title="送信"
            disabled={isLoading}
          >
            <span className="icon">➤</span>
          </button>
        </div>
      </div>
    </form>
  );
}
