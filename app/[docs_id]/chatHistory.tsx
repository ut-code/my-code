"use client";

import { type ChatWithMessages } from "@/lib/chatHistory";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IChatHistoryContext {
  chatHistories: ChatWithMessages[];
  addChat: (chat: ChatWithMessages) => void;
  // updateChat: (sectionId: string, chatId: string, message: ChatMessage) => void;
}
const ChatHistoryContext = createContext<IChatHistoryContext | null>(null);
export function useChatHistoryContext() {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error(
      "useChatHistoryContext must be used within a ChatHistoryProvider"
    );
  }
  return context;
}

export function ChatHistoryProvider({
  children,
  initialChatHistories,
}: {
  children: ReactNode;
  initialChatHistories: ChatWithMessages[];
}) {
  const [chatHistories, setChatHistories] =
    useState<ChatWithMessages[]>(initialChatHistories);
  useEffect(() => {
    setChatHistories(initialChatHistories);
  }, [initialChatHistories]);

  const addChat = (chat: ChatWithMessages) => {
    // サーバー側で追加された新しいchatをクライアント側にも反映する
    setChatHistories([...chatHistories, chat]);
  };

  return (
    <ChatHistoryContext.Provider value={{ chatHistories, addChat }}>
      {children}
    </ChatHistoryContext.Provider>
  );
}
