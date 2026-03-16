import { ChatAreaStateUpdater } from "@/(docs)/chatAreaState";
import { StyledMarkdown } from "@/markdown/markdown";
import clsx from "clsx";
import Link from "next/link";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  // TODO: 実際のchatを取得
  const messages = [
    { role: "user", content: "a" },
    { role: "ai", content: "b" },
  ];

  return (
    <aside
      className={clsx(
        // モバイルでは全画面表示する
        "fixed inset-0 pt-16 bg-base-100",
        // PCではスクロールで動かない右サイドバー
        "lg:sticky lg:top-0 lg:pt-0 lg:w-1/3 lg:h-screen lg:shadow-md lg:bg-base-200 ",
        "overflow-y-auto"
      )}
    >
      <ChatAreaStateUpdater chatId={chatId} />
      {chatId}
      <Link className="btn" href="/chat">
        閉じる
      </Link>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
        >
          <div
            className={clsx(
              msg.role === "user" && "chat-bubble p-0.5! bg-secondary/30",
              msg.role === "ai" && "chat-bubble p-0.5!",
              msg.role === "error" && "text-error"
            )}
            style={{ maxWidth: "100%", wordBreak: "break-word" }}
          >
            <StyledMarkdown content={msg.content} />
          </div>
        </div>
      ))}
    </aside>
  );
}
