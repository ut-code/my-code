"use client";

import { useEffect } from "react";
import Loading from "./[lang]/[pageId]/loading";
import { getRedirectFromChat } from "@/actions/getRedirectFromChat";
import { usePathname, useRouter } from "next/navigation";

// /chat/チャットid に直接アクセスした場合には、
// チャットからそれに対応するページidを取得し、そのドキュメントに自動でリダイレクトする。
export default function DocsDefaultPage() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (pathname.startsWith("/chat/")) {
      const chatId = pathname.split("/chat/")[1];
      getRedirectFromChat(chatId).then((path) => {
        router.replace(path);
      });
    }
  }, [pathname, router]);

  return <Loading />;
}
