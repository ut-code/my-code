"use client";

import { ChatWithMessages, getChat } from "@/lib/chatHistory";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";

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
  docs_id,
  initialChatHistories,
}: {
  children: ReactNode;
  docs_id: string;
  initialChatHistories: ChatWithMessages[];
}) {
  const [chatHistories, setChatHistories] =
    useState<ChatWithMessages[]>(initialChatHistories);
  // 最初はSSRで取得したinitialChatHistoriesを使用(キャッシュされているので古い可能性がある)
  useEffect(() => {
    setChatHistories(initialChatHistories);
  }, [initialChatHistories]);
  // その後、クライアント側で最新のchatHistoriesを改めて取得して更新する
  const { data: fetchedChatHistories } = useSWR<ChatWithMessages[]>(
    docs_id,
    getChat,
    {
      // リクエストは古くても構わないので1回でいい
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => {
    if (fetchedChatHistories) {
      setChatHistories(fetchedChatHistories);
    }
  }, [fetchedChatHistories]);

  // チャットを更新した際にはクライアントサイドでchatHistoryに反映する
  const addChat = (chat: ChatWithMessages) => {
    setChatHistories([...chatHistories, chat]);
  };

  return (
    <ChatHistoryContext.Provider value={{ chatHistories, addChat }}>
      {children}
    </ChatHistoryContext.Provider>
  );
}
