"use client";

import { useState, FormEvent, useEffect } from "react";
import { askAI } from "@/app/actions/chatActions";
import { StyledMarkdown } from "./markdown";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatFormProps {
  documentContent: string;
  sectionId: string;
}

export function ChatForm({ documentContent, sectionId }: ChatFormProps) {
  const CHAT_HISTORY_KEY = `my-code-chat-history-${sectionId}`;

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    }
  }, [CHAT_HISTORY_KEY]);

  useEffect(() => {
    if (messages.length === 0) {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    } else {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages, CHAT_HISTORY_KEY]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const userMessage: Message = { sender: "user", text: inputValue };
    setMessages([userMessage]);

    const result = await askAI({
      userQuestion: inputValue,
      documentContent: documentContent,
    });

    if (result.error) {
      const errorMessage: Message = { sender: "ai", text: `エラー: ${result.error}` };
      setMessages([userMessage, errorMessage]);
    } else {
      const aiMessage: Message = { sender: "ai", text: result.response };
      setMessages([userMessage, aiMessage]);
    }

    setInputValue("");
    setIsLoading(false);
  };
  return (
    <>
      {isFormVisible && (
      <form className="border border-2 border-secondary shadow-xl p-6 rounded-lg bg-base-100" style={{width:"100%", textAlign:"center", boxShadow:"-moz-initial"}} onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4 text-left relative -top-2 font-mono h-2">
            AIへ質問
          </h2>
        <div className="input-area" style={{height:"80px"}}>
            <textarea
              className="textarea textarea-white textarea-md"
              placeholder="質問を入力してください"
            style={{width: "100%", height: "110px", resize: "none"}}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>
          <br />
        <div className="controls" style={{position:"relative", top:"22px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
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
              style={{marginTop:"10px"}}
                disabled={isLoading || !inputValue.trim()}
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
          onClick={() => setIsFormVisible(true)}
        >
          チャットを開く
        </button>
      )}

      {messages.length > 0 && (
        <article className="mt-4">
          <h3 className="text-lg font-semibold mb-2">AIとのチャット</h3>
          {messages.map((msg, index) => (
            <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
              <div className={`chat-bubble ${msg.sender === 'user' ? 'bg-primary text-primary-content' : 'bg-secondary-content text-black'}`} style={{maxWidth: "100%", wordBreak: "break-word"}}>
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