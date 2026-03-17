"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export interface StreamingChatState {
  streamingChatId: string | null;
  userQuestion: string;
  streamingContent: string;
  isStreaming: boolean;
}

interface StreamingChatActions {
  startStreaming: (chatId: string, userQuestion: string) => void;
  appendChunk: (chunk: string) => void;
  finishStreaming: () => void;
  clearStreaming: () => void;
}

const StreamingChatContext = createContext<
  StreamingChatState & StreamingChatActions
>(null!);

export function useStreamingChat() {
  return useContext(StreamingChatContext);
}

export function StreamingChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StreamingChatState>({
    streamingChatId: null,
    userQuestion: "",
    streamingContent: "",
    isStreaming: false,
  });

  const startStreaming = (chatId: string, userQuestion: string) => {
    setState({
      streamingChatId: chatId,
      userQuestion,
      streamingContent: "",
      isStreaming: true,
    });
  };

  const appendChunk = (chunk: string) => {
    setState((prev) => ({
      ...prev,
      streamingContent: prev.streamingContent + chunk,
    }));
  };

  const finishStreaming = () => {
    setState((prev) => ({ ...prev, isStreaming: false }));
  };

  const clearStreaming = () => {
    setState({
      streamingChatId: null,
      userQuestion: "",
      streamingContent: "",
      isStreaming: false,
    });
  };

  return (
    <StreamingChatContext.Provider
      value={{ ...state, startStreaming, appendChunk, finishStreaming, clearStreaming }}
    >
      {children}
    </StreamingChatContext.Provider>
  );
}
