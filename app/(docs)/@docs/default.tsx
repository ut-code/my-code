"use client";

import { useEffect, useState } from "react";
import Loading from "./[lang]/[pageId]/loading";
import { getRedirectFromChat } from "@/actions/getRedirectFromChat";
import { usePathname, useRouter } from "next/navigation";
import ErrorPage from "@/error";

// /chat/チャットid に直接アクセスした場合には、
// チャットからそれに対応するページidを取得し、そのドキュメントに自動でリダイレクトする。
export default function DocsDefaultPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [error, setError] = useState<unknown>(null);
  useEffect(() => {
    if (pathname.startsWith("/chat/")) {
      const chatId = pathname.split("/chat/")[1];
      getRedirectFromChat(chatId)
        .then((path) => {
          router.replace(path);
        })
        .catch((err) => {
          console.error("Failed to get redirect path from chat:", err);
          setError(err);
        });
    } else if (pathname === "/chat") {
      router.replace("/");
    } else {
      throw new Error(`Invalid path: ${pathname}`);
    }
  }, [pathname, router]);

  if (error) {
    return <ErrorPage error={error} reset={() => router.refresh()} />;
  }

  return <Loading />;
}
