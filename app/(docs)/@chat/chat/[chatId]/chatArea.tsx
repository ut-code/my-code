"use client";

import { ChatAreaStateUpdater } from "@/(docs)/chatAreaState";
import { deleteChatAction } from "@/actions/deleteChat";
import { ChatWithMessages } from "@/lib/chatHistory";
import { LanguageEntry, MarkdownSection, PageEntry } from "@/lib/docs";
import { Heading } from "@/markdown/heading";
import { StyledMarkdown } from "@/markdown/markdown";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function ChatAreaContainer(props: { chatId: string; children: ReactNode }) {
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

interface Props {
  chatId: string;
  chatData: ChatWithMessages;
  targetLang: LanguageEntry | undefined;
  targetPage: PageEntry | undefined;
  targetSection: MarkdownSection | undefined;
}
export function ChatAreaContent(props: Props) {
  const { chatId, chatData, targetLang, targetPage, targetSection } = props;

  const messagesAndDiffs = [
    ...chatData.messages.map((msg) => ({ type: "message" as const, ...msg })),
    ...chatData.diff.map((diff) => ({ type: "diff" as const, ...diff })),
  ];
  messagesAndDiffs.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const router = useRouter();

  return (
    <>
      <Heading level={2} className="mt-2!">
        {chatData.title}
      </Heading>
      <div className="flex-none breadcrumbs text-sm">
        <ul className="flex-wrap">
          <li>
            <Link href={`/${targetLang?.id}/${targetLang?.pages[0].slug}`}>
              {targetLang?.name}
            </Link>
          </li>
          <li>
            <Link href={`/${chatData.section.pagePath}`}>
              {targetPage?.index}. {targetPage?.name}
            </Link>
          </li>
          <li>
            <Link href={`/${chatData.section.pagePath}#${chatData.sectionId}`}>
              {targetSection?.title}
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-wrap items-center">
        <div className="flex-1 text-sm opacity-40" suppressHydrationWarning>
          {chatData.createdAt.toLocaleString()}
        </div>
        <button
          className="btn btn-error btn-soft btn-sm"
          onClick={async () => {
            if (confirm("このチャットを削除してもよろしいですか?")) {
              await deleteChatAction(chatId);
              router.push("/chat", { scroll: false });
              router.refresh();
            }
          }}
        >
          {/*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 11V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 7H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          削除
        </button>
      </div>
      <div className="divider" />
      {messagesAndDiffs.map((msg, index) =>
        msg.type === "message" ? (
          msg.role === "user" ? (
            <div key={index} className="chat chat-end">
              <div
                className="chat-bubble p-0.5! bg-secondary/30"
                style={{ maxWidth: "100%", wordBreak: "break-word" }}
              >
                <StyledMarkdown content={msg.content} />
              </div>
            </div>
          ) : msg.role === "ai" ? (
            <div key={index} className="">
              <StyledMarkdown content={msg.content} />
            </div>
          ) : (
            <div key={index} className="text-error">
              {msg.content}
            </div>
          )
        ) : (
          <div
            key={index}
            className={clsx(
              "bg-base-300 rounded-lg border border-2 border-secondary/50"
            )}
          >
            {/* pb-0だとmargin collapsingが起きて変な隙間が空く */}
            <del
              className={clsx(
                "block p-2 pb-[1px] bg-error/10",
                "line-through decoration-[color-mix(in_oklab,var(--color-error)_70%,currentColor)]"
              )}
            >
              <StyledMarkdown content={msg.search} />
            </del>
            <ins className="block no-underline p-2 pt-[1px] bg-success/10">
              <StyledMarkdown content={msg.replace} />
            </ins>
          </div>
        )
      )}
    </>
  );
}
