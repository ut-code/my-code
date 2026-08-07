"use client";

import {
  useState,
  FormEvent,
  useEffect,
  useMemo,
} from "react";
// import useSWR from "swr";
// import {
//   getQuestionExample,
//   QuestionExampleParams,
// } from "../actions/questionExample";
// import { getLanguageName } from "../pagesList";
import { DynamicMarkdownSection, PagePath } from "@/lib/docs";
import { useSendChat } from "@/(docs)/useSendChat";

interface ChatFormProps {
  path: PagePath;
  langName: string;
  sectionContent: DynamicMarkdownSection[];
  close: () => void;
}

export function ChatForm({ path, langName, sectionContent, close }: ChatFormProps) {
  // const [messages, updateChatHistory] = useChatHistory(sectionId);
  const [inputValue, setInputValue] = useState("");
  const [questionScope, setQuestionScope] = useState<"page" | "language">(
    "page"
  );

  const { sendChat, isLoading, errorMessage } = useSendChat();

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
    e.preventDefault();
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

    await sendChat({
      path,
      userQuestion,
      questionScope,
      sectionContent,
      onSuccess: () => {
        setInputValue("");
        close();
      },
    });
  };

  return (
    <form
      className="border border-2 border-secondary shadow-lg rounded-box bg-base-100/60 backdrop-blur-xs"
      style={{
        width: "100%",
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
      <div className="px-3 flex flex-wrap gap-3 text-sm">
        <label className="label cursor-pointer gap-2">
          <input
            type="radio"
            className="radio radio-sm radio-secondary"
            name="question-scope"
            value="page"
            checked={questionScope === "page"}
            onChange={() => setQuestionScope("page")}
            disabled={isLoading}
          />
          <span className="label-text">このページの内容について質問</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input
            type="radio"
            className="radio radio-sm radio-secondary"
            name="question-scope"
            value="language"
            checked={questionScope === "language"}
            onChange={() => setQuestionScope("language")}
            disabled={isLoading}
          />
          <span className="label-text">{`${langName}全体について質問`}</span>
        </label>
      </div>
      <div
        className="m-3"
        style={{
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
