"use client";

import { useState, useEffect, useCallback } from 'react';

export interface Message {
  sender: "user" | "ai";
  text: string;
  isError?: boolean;
}

export const useChatHistory = (sectionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const CHAT_HISTORY_KEY = `my-code-chat-history-${sectionId}`;

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
      setMessages([]);
    }
  }, [CHAT_HISTORY_KEY]);

  const updateChatHistory = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    if (newMessages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
    } else {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  }, [CHAT_HISTORY_KEY]);

  return [messages, updateChatHistory] as const;
};