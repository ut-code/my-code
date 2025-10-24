"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ChatMessage {
  sender: "user" | "ai" | "error";
  text: string;
}

export interface IChatHistoryContext {
  chatHistories: Record<string, Record<string, ChatMessage[]>>;
  addChat: (sectionId: string, messages: ChatMessage[]) => string;
  updateChat: (sectionId: string, chatId: string, message: ChatMessage) => void;
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

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [chatHistories, setChatHistories] = useState<
    Record<string, Record<string, ChatMessage[]>>
  >({});
  useEffect(() => {
    // Load chat histories from localStorage on mount
    const chatHistories: Record<string, Record<string, ChatMessage[]>> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("chat/") && key.split("/").length === 3) {
        const savedHistory = localStorage.getItem(key);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, sectionId, chatId] = key.split("/");
        if (savedHistory) {
          if (!chatHistories[sectionId]) {
            chatHistories[sectionId] = {};
          }
          chatHistories[sectionId][chatId] = JSON.parse(savedHistory);
        }
      }
    }
    setChatHistories(chatHistories);
  }, []);

  const addChat = (sectionId: string, messages: ChatMessage[]): string => {
    const chatId = Date.now().toString();
    const newChatHistories = { ...chatHistories };
    if (!newChatHistories[sectionId]) {
      newChatHistories[sectionId] = {};
    }
    newChatHistories[sectionId][chatId] = messages;
    setChatHistories(newChatHistories);
    localStorage.setItem(
      `chat/${sectionId}/${chatId}`,
      JSON.stringify(messages)
    );
    return chatId;
  };
  const updateChat = (
    sectionId: string,
    chatId: string,
    message: ChatMessage
  ) => {
    const newChatHistories = { ...chatHistories };
    if (newChatHistories[sectionId] && newChatHistories[sectionId][chatId]) {
      newChatHistories[sectionId][chatId] = [
        ...newChatHistories[sectionId][chatId],
        message,
      ];
      setChatHistories(newChatHistories);
      localStorage.setItem(
        `chat/${sectionId}/${chatId}`,
        JSON.stringify(newChatHistories[sectionId][chatId])
      );
    }
  };

  return (
    <ChatHistoryContext.Provider value={{ chatHistories, addChat, updateChat }}>
      {children}
    </ChatHistoryContext.Provider>
  );
}
