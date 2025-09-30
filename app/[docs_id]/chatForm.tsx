"use client";

import { useState, FormEvent } from "react";
import clsx from "clsx";
import { askAI } from "@/app/actions/chatActions";
import { StyledMarkdown } from "./markdown";
import { useChatHistory, type Message } from "../hooks/useChathistory";
import useSWR from "swr";
import { getQuestionExample } from "../actions/questionExample";
import { getLanguageName } from "../pagesList";

interface ChatFormProps {
  documentContent: string;
  sectionId: string;
}

export function ChatForm({ documentContent, sectionId }: ChatFormProps) {
  const [messages, updateChatHistory] = useChatHistory(sectionId);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const lang = getLanguageName(sectionId);
  const { data: exampleData, error: exampleError } = useSWR(
    // 質問フォームを開いたときだけで良い
    isFormVisible ? { lang, documentContent } : null,
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
    if(!userQuestion && exampleData){
      // 質問が空欄なら、質問例を使用
      userQuestion = exampleData[Math.floor(exampleChoice * exampleData.length)];
      setInputValue(userQuestion);
    }

    const result = await askAI({
      userQuestion,
      documentContent: documentContent,
    });

    if (result.error) {
      const errorMessage: Message = { sender: "ai", text: `エラー: ${result.error}`, isError: true };
      updateChatHistory([userMessage, errorMessage]);
    } else {
      const aiMessage: Message = { sender: "ai", text: result.response };
      updateChatHistory([userMessage, aiMessage]);
      setInputValue("");
    }

    setIsLoading(false);
  };

  const handleClearHistory = () => {
    updateChatHistory([]);
  };
  
  return (
    <>
      {isFormVisible && (
      <form className="border border-2 border-secondary shadow-md rounded-lg bg-base-100" style={{width:"100%", textAlign:"center", boxShadow:"-moz-initial"}} onSubmit={handleSubmit}>
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
        <div className="controls" style={{margin:"10px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div className="left-icons">
              <button
                className="btn btn-soft btn-secondary rounded-full"
                onClick={() => setIsFormVisible(false)}
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
      )}
      {!isFormVisible && (
        <button
          className="btn btn-soft btn-secondary rounded-full"
          onClick={() => {
            setIsFormVisible(true);
            setExampleChoice(Math.random());
          }}
        >
          チャットを開く
        </button>
      )}

      {messages.length > 0 && (
        <article className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">AIとのチャット</h3>
            <button
              onClick={handleClearHistory}
              className="btn btn-ghost btn-sm text-xs"
              aria-label="チャット履歴を削除"
            >
              履歴を削除
            </button>
          </div>
          {messages.map((msg, index) => (
            <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
              <div 
                className={clsx(
                  "chat-bubble",
                  { "bg-primary text-primary-content": msg.sender === 'user' },
                  { "bg-secondary-content dark:bg-neutral text-black dark:text-white": msg.sender === 'ai' && !msg.isError },
                  { "chat-bubble-error": msg.isError }
                )} 
                style={{maxWidth: "100%", wordBreak: "break-word"}}
              >
                <StyledMarkdown content={msg.text} />
              </div>
            </div>
          ))}
        </article>
      )}

      {isLoading && (
        <div className="mt-2 text-l text-gray-500 animate-pulse">
          AIが考え中です…
        </div>
      )}

    </>
  );
}