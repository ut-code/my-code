import { getChatOne, initContext } from "@/lib/chatHistory";
import { getMarkdownSections, getPagesList } from "@/lib/docs";
import { ChatAreaContent } from "./chatArea";
import { ChatAreaStateUpdater } from "@/(docs)/chatAreaState";
import { ReactNode } from "react";
import clsx from "clsx";
import Link from "next/link";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const ctx = await initContext();
  const chatData = await getChatOne(chatId, ctx);

  if (!chatData) {
    // notFound(); だとページ全体が404になってしまう
    return (
      <ChatAreaContainer chatId={chatId}>
        <p>指定されたチャットのデータが見つかりません。</p>
      </ChatAreaContainer>
    );
  }

  const pagesList = await getPagesList();
  const targetLang = pagesList.find(
    (lang) => lang.id === chatData.section.pagePath.split("/")[0]
  );
  const targetPage = targetLang?.pages.find(
    (page) => page.slug === chatData.section.pagePath.split("/")[1]
  );
  const sections = await getMarkdownSections(targetLang!.id, targetPage!.slug);
  const targetSection = sections.find((sec) => sec.id === chatData.sectionId);

  return (
    <ChatAreaContainer chatId={chatId}>
      <ChatAreaContent
        chatId={chatId}
        chatData={chatData}
        targetLang={targetLang}
        targetPage={targetPage}
        targetSection={targetSection}
      />
    </ChatAreaContainer>
  );
}

function ChatAreaContainer(props: { chatId: string; children: ReactNode }) {
  return (
    <aside
      className={clsx(
        // モバイルでは全画面表示する
        "fixed inset-0 pt-20 bg-base-100",
        // PCではスクロールで動かない右サイドバー
        "lg:sticky lg:top-0 lg:pt-4 lg:w-1/3 lg:h-screen lg:shadow-md lg:bg-base-200 ",
        "p-4",
        "flex flex-col",
        "overflow-y-auto"
      )}
    >
      <ChatAreaStateUpdater chatId={props.chatId} />
      <div className="flex flex-row items-center">
        <span className="flex-1 text-base font-bold opacity-40">
          AIへの質問
        </span>
        <Link className="btn btn-ghost" href="/chat" scroll={false}>
          <svg
            className="w-8 h-8 -scale-x-100"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 17L13 12L18 7M11 17L6 12L11 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg">閉じる</span>
        </Link>
      </div>
      {props.children}
    </aside>
  );
}
