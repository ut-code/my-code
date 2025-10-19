"use client";

import { useState, FormEvent } from "react";
import clsx from "clsx";
import { askAI } from "@/app/actions/chatActions";
import { StyledMarkdown } from "./markdown";
import { useChatHistory, type Message } from "../hooks/useChathistory";
import useSWR from "swr";
import { getQuestionExample } from "../actions/questionExample";
import { getLanguageName } from "../pagesList";
import { ReplCommand, ReplOutput } from "../terminal/repl";
import { MarkdownSection } from "./splitMarkdown";

interface ChatFormProps {
  docs_id: string;
  splitMdContent: MarkdownSection[];
  sectionInView: boolean[];
  onClose: () => void;
  replOutputs: ReplCommand[];
  fileContents: Array<{
    name: string;
    content: string;
  }>;
  execResults: Record<string, ReplOutput[]>;
}

export function ChatForm({
  docs_id,
  splitMdContent,
  sectionInView,
  onClose,
  replOutputs,
  fileContents,
  execResults,
}: ChatFormProps) {
  // const [messages, updateChatHistory] = useChatHistory(sectionId);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const lang = getLanguageName(docs_id);

  const documentContentInView = splitMdContent
    .filter((_, index) => sectionInView[index])
    .map(
      (section) =>
        `${"#".repeat(section.level)} ${section.title}\n${section.content}`
    )
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const userMessage: Message = { sender: "user", text: inputValue };
    updateChatHistory([userMessage]);

    let userQuestion = inputValue;
    if (!userQuestion && exampleData) {
      // 質問が空欄なら、質問例を使用
      userQuestion =
        exampleData[Math.floor(exampleChoice * exampleData.length)];
      setInputValue(userQuestion);
    }

    const result = await askAI({
      userQuestion,
      documentContent: documentContent,
      replOutputs,
      fileContents,
      execResults,
    });

    if (result.error) {
      const errorMessage: Message = {
        sender: "ai",
        text: `エラー: ${result.error}`,
        isError: true,
      };
      updateChatHistory([userMessage, errorMessage]);
    } else {
      const aiMessage: Message = { sender: "ai", text: result.response };
      updateChatHistory([userMessage, aiMessage]);
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
        boxShadow: "-moz-initial",
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
            onClick={onClose}
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
