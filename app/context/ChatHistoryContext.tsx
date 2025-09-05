"use client";

import { createContext, ReactNode, useCallback, useContext, useState, useEffect } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface IChatHistoryContext {
  chatHistories: Record<string, Message[]>;
  setChatHistory: (sectionId: string, messages: Message[]) => void;
}

const ChatHistoryContext = createContext<IChatHistoryContext | null>(null);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  return context;
};

const CHAT_HISTORY_STORAGE_KEY = "my-code-all-chat-histories";

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    try {
      const savedHistories = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (savedHistories) {
        setChatHistories(JSON.parse(savedHistories));
      }
    } catch (error) {
      console.error("Failed to load chat histories from localStorage", error);
    }
  }, []);

  const setChatHistory = useCallback((sectionId: string, messages: Message[]) => {
    setChatHistories(prevHistories => {
      const newHistories = { ...prevHistories };
      if (messages.length === 0) {
        delete newHistories[sectionId];
      } else {
        newHistories[sectionId] = messages;
      }

      if (Object.keys(newHistories).length > 0) {
        localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(newHistories));
      } else {
        localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
      }

      return newHistories;
    });
  }, []);

  return (
    <ChatHistoryContext.Provider value={{ chatHistories, setChatHistory }}>
      {children}
    </ChatHistoryContext.Provider>
  );
}