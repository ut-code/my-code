"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// 今開いているチャットのid or null を、@chat側でセットして、@docs側で取得するためのコンテキスト

interface ChatAreaState {
  chatId: string | null;
  setChatId: (chatId: string | null) => void;
}
const ChatAreaStateContext = createContext<ChatAreaState>(null!);

export function useChatId() {
  const { chatId } = useContext(ChatAreaStateContext);
  return chatId;
}
export function ChatAreaStateUpdater(props: { chatId: string | null }) {
  const { chatId, setChatId } = useContext(ChatAreaStateContext);
  useEffect(() => {
    if (chatId !== props.chatId) {
      setChatId(props.chatId);
    }
  }, [chatId, setChatId, props.chatId]);
  return null;
}

export function ChatAreaStateProvider(props: { children: ReactNode }) {
  const [chatId, setChatId] = useState<string | null>(null);
  return (
    <ChatAreaStateContext.Provider value={{ chatId, setChatId }}>
      {props.children}
    </ChatAreaStateContext.Provider>
  );
}
