"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface StreamingChatContextData {
  chatId: string | null;
  content: string;
  startStreaming: (chatId: string) => void;
  appendChunk: (chunk: string) => void;
  finishStreaming: () => void;
}

const StreamingChatContext = createContext<StreamingChatContextData>(null!);

export function useStreamingChatContext() {
  return useContext(StreamingChatContext);
}

export function StreamingChatProvider({ children }: { children: ReactNode }) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [content, setContent] = useState("");

  const startStreaming = useCallback((chatId: string) => {
    setContent("");
    setChatId(chatId);
  }, []);

  const appendChunk = useCallback((chunk: string) => {
    setContent((prev) => prev + chunk);
  }, []);

  const finishStreaming = useCallback(() => {
    setChatId(null);
    setContent("");
  }, []);

  return (
    <StreamingChatContext.Provider
      value={{
        chatId,
        content,
        startStreaming,
        appendChunk,
        finishStreaming,
      }}
    >
      {children}
    </StreamingChatContext.Provider>
  );
}
