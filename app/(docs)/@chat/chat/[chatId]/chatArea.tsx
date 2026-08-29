"use client";

import { ChatAreaStateUpdater } from "@/(docs)/chatAreaState";
import { useStreamingChatContext } from "@/(docs)/streamingChatContext";
import { useSendChat } from "@/(docs)/useSendChat";
import { deleteChatAction } from "@/actions/deleteChat";
import { ChatWithMessages } from "@/lib/chatHistory";
import {
  DynamicMarkdownSection,
  LangId,
  MarkdownSection,
  PageSlug,
} from "@/lib/docs";
import { Heading } from "@/markdown/heading";
import { StyledMarkdown } from "@/markdown/markdown";
import { usePagesListForLang } from "@/pagesListContext";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function ChatAreaContainer(props: {
  chatId: string;
  children: ReactNode;
}) {
  return (
    <aside
      className={clsx(
        // モバイルでは全画面表示する
        "fixed inset-0 bg-base-100",
        // PCではスクロールで動かない右サイドバー
        // 左にサイドバーがない=navvarがある とき、navbar分のスペースをあける(top-16, h-[100vh-4rem])
        "has-chat-1:sticky has-chat-1:top-16 has-sidebar:top-0",
        "has-chat-1:basis-2/5 has-chat-1:max-w-chat-area has-chat-1:h-[calc(100vh-4rem)] has-sidebar:h-screen",
        "has-chat-1:shadow-md has-chat-1:bg-base-200",
        // navbar(z-40)よりは下、ChatListForSectionのdropdown(デフォルトでz-999だがz-30に変えている)よりも上
        "z-35"
      )}
    >
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-base-200 to-base-200/0 z-1" />
      <div
        className={clsx(
          "p-4 pb-16",
          "pt-20 has-chat-1:pt-4",
          "h-full flex flex-col overflow-y-auto"
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
      </div>
    </aside>
  );
}

interface Props {
  chatId: string;
  chatData: ChatWithMessages;
  langId: LangId;
  pageSlug: PageSlug;
  targetSection: MarkdownSection | undefined;
  priorSectionContent: DynamicMarkdownSection[];
}
export function ChatAreaContent(props: Props) {
  const {
    chatId,
    chatData,
    langId,
    pageSlug,
    targetSection,
    priorSectionContent,
  } = props;

  const langEntry = usePagesListForLang(langId);
  const pageEntry = langEntry?.pages.find((p) => p.slug === pageSlug);

  const messagesAndDiffs = [
    ...chatData.messages.map((msg) => ({ type: "message" as const, ...msg })),
    ...chatData.diff.map((diff) => ({ type: "diff" as const, ...diff })),
  ];
  messagesAndDiffs.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const router = useRouter();
  const streamingChatContext = useStreamingChatContext();
  const isStreamingThis = streamingChatContext.chatId === chatId;
  const { sendChat, isLoading: isRegenerating } = useSendChat();

  const handleRegenerate = async () => {
    if (!confirm("このチャットを削除して再生成してもよろしいですか?")) {
      return;
    }
    const firstUserMsg = chatData.messages.find((m) => m.role === "user");
    const userQuestion = firstUserMsg ? firstUserMsg.content : chatData.title;

    await sendChat({
      path: { lang: langId, page: pageSlug },
      userQuestion,
      questionScope: "page",
      sectionContent: priorSectionContent,
      deleteChatOnCreated: chatId,
      replOutputs: chatData.replOutputs ?? {},
      files: chatData.files ?? {},
      execResults: chatData.execResults ?? {},
    });
  };

  return (
    <>
      <Heading level={2} className="mt-2!">
        {chatData.title}
      </Heading>
      <div className="flex-none breadcrumbs text-sm">
        <ul className="flex-wrap">
          <li>
            <Link
              href={
                langEntry?.pages[0]
                  ? `/${langId}/${langEntry.pages[0].slug}`
                  : `/${langId}/sandbox`
              }
            >
              {langEntry?.name ?? langId}
            </Link>
          </li>
          <li>
            <Link href={`/${chatData.section.pagePath}`}>
              {pageEntry ? `${pageEntry.index}. ${pageEntry.name}` : "Sandbox"}
            </Link>
          </li>
          {targetSection?.title && targetSection.title !== "sandbox" && (
            <li>
              <Link
                href={`/${chatData.section.pagePath}#${chatData.sectionId}`}
              >
                {targetSection.title}
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 text-sm opacity-40" suppressHydrationWarning>
          {chatData.createdAt.toLocaleString()}
        </div>
        <button
          className="btn btn-secondary btn-soft btn-sm"
          disabled={isStreamingThis || isRegenerating}
          onClick={handleRegenerate}
        >
          <svg
            className={clsx("w-4 h-4", isRegenerating && "animate-spin")}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.06189 13C4.55399 16.944 7.92083 20 12 20C15.5463 20 18.5721 17.7719 19.5714 14.619"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.9381 11C19.446 7.05601 16.0792 4 12 4C8.45371 4 5.42788 6.22811 4.42857 9.38095"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14.619H19.5714V20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 9.38095H4.42857V4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          再生成
        </button>
        <button
          className="btn btn-error btn-soft btn-sm"
          disabled={isStreamingThis || isRegenerating}
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
      {isStreamingThis && (
        <div className="">
          <StyledMarkdown content={streamingChatContext.content} />
          <span className="loading loading-dots loading-sm" />
        </div>
      )}
    </>
  );
}
