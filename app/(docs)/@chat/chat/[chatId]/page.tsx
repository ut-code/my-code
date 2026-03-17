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
      {chatData?.messages.map((msg, index) =>
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
      )}
    </aside>
  );
}
