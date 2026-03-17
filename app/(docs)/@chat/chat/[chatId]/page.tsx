import { ChatAreaStateUpdater } from "@/(docs)/chatAreaState";
import { getChatOne, initContext } from "@/lib/chatHistory";
import { getMarkdownSections, getPagesList } from "@/lib/docs";
import { StyledMarkdown } from "@/markdown/markdown";
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

  const pagesList = await getPagesList();
  const targetLang = pagesList.find(
    (lang) => lang.id === chatData.section.pagePath.split("/")[0]
  );
  const targetPage = targetLang?.pages.find(
    (page) => page.slug === chatData.section.pagePath.split("/")[1]
  );
  const sections = await getMarkdownSections(targetLang!.id, targetPage!.slug);
  const targetSection = sections.find((sec) => sec.id === chatData.sectionId);

  const messagesAndDiffs = [
    ...chatData.messages.map((msg) => ({ type: "message" as const, ...msg })),
    ...chatData.diff.map((diff) => ({ type: "diff" as const, ...diff })),
  ];
  messagesAndDiffs.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return (
    <aside
      className={clsx(
        // モバイルでは全画面表示する
        "fixed inset-0 pt-20 bg-base-100",
        // PCではスクロールで動かない右サイドバー
        "lg:sticky lg:top-0 lg:pt-4 lg:w-1/3 lg:h-screen lg:shadow-md lg:bg-base-200 ",
        "p-4",
        "flex flex-col gap-2",
        "overflow-y-auto"
      )}
    >
      <ChatAreaStateUpdater chatId={chatId} />
      {chatId}
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
      <Link className="btn" href="/chat">
        閉じる
      </Link>
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
    </aside>
  );
}
