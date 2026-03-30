"use client";

import { useSyncExternalStore } from "react";

// --- SSR無効化のためのカスタムフック準備 ---
const subscribe = () => () => {};
const getSnapshot = () => true; // クライアントでは true
const getServerSnapshot = () => false; // サーバーでは false

export function useIsClient() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
