"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ChatForm } from "./chatForm";
import { StyledMarkdown } from "@/markdown/markdown";
import { useSidebarMdContext } from "@/sidebar";
import clsx from "clsx";
import { PageTransition } from "./pageTransition";
import {
  DynamicMarkdownSection,
  LangId,
  PagePath,
  PageSlug,
  SectionId,
  SectionWithDiff,
} from "@/lib/docs";
import { Heading } from "@/markdown/heading";
import Link from "next/link";
import { useChatId } from "@/(docs)/chatAreaState";
import { ChatWithMessages } from "@/lib/chatHistory";
import { usePagesListForLang } from "@/pagesListContext";
import { useRouter } from "next/navigation";
import { revalidateChatAction } from "@/actions/revalidateChat";
import { RegenerateStreamEvent } from "@/api/chat/regenerate-section/route";
import { captureException } from "@sentry/nextjs";

interface PageContentProps {
  splitMdContent: SectionWithDiff[];
  langId: LangId;
  pageSlug: PageSlug;
  path: PagePath;
  chatHistories: ChatWithMessages[];
}
export function PageContent(props: PageContentProps) {
  const { setSidebarMdContent } = useSidebarMdContext();
  const { splitMdContent, langId, pageSlug, path, chatHistories } = props;

  const langEntry = usePagesListForLang(langId);
  const pageEntryIndex =
    langEntry?.pages.findIndex((p) => p.slug === pageSlug) ?? -1;
  const pageEntry = langEntry?.pages[pageEntryIndex];
  const prevPage = langEntry?.pages[pageEntryIndex - 1];
  const nextPage = langEntry?.pages[pageEntryIndex + 1];

  const [sectionInView, setSectionInView] = useState<boolean[]>([]);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  useEffect(() => {
    const handleScroll = () => {
      setSectionInView((sectionInView) => {
        sectionInView = sectionInView.slice(); // Reactの変更検知のために新しい配列を作成
        for (
          let i = 0;
          i < sectionRefs.current.length || i < sectionInView.length;
          i++
        ) {
          if (sectionRefs.current.at(i)) {
            const rect = sectionRefs.current.at(i)!.getBoundingClientRect();
            sectionInView[i] =
              rect.top < window.innerHeight * 0.9 &&
              rect.bottom >= window.innerHeight * 0.1;
          } else {
            sectionInView[i] = false;
          }
        }
        return sectionInView;
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dynamicMdContent = useMemo(() => {
    return splitMdContent.map((section, i) => ({
      ...section,
      inView: sectionInView[i] ?? false,
    }));
  }, [splitMdContent, sectionInView]);

  useEffect(() => {
    // props.splitMdContentが変わったとき, チャットのdiffが変わった時に
    // sidebarのcontextを更新
    setSidebarMdContent(path, dynamicMdContent);
  }, [dynamicMdContent, path, setSidebarMdContent]);

  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="flex-1 p-4 pb-16 flex flex-col">
      <div
        className="max-w-full mx-auto grid"
        style={{
          gridTemplateColumns: `1fr auto`,
        }}
      >
        <Heading className="max-w-docs" level={1}>
          第{pageEntry?.index}章: {pageEntry?.title}
        </Heading>
        <div />
        {dynamicMdContent.map((section, index) => (
          <Fragment key={section.id}>
            <section
              className={clsx(
                "min-w-1/2 max-w-docs text-justify",
                section.isOutdated &&
                  "rounded-box border border-secondary/20 bg-secondary/3 p-1.5 shadow-xs"
              )}
              id={section.id} // 目次からaタグで飛ぶために必要
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
            >
              {section.isOutdated && (
                <OutdatedSectionAlert
                  sectionId={section.id}
                  splitMdContent={splitMdContent}
                  chatHistories={chatHistories}
                  path={path}
                />
              )}
              {/* ドキュメントのコンテンツ */}
              <StyledMarkdown
                content={section.replacedContent}
                replacedRange={section.replacedRange}
                interactive
              />
            </section>
            <div>
              <ChatListForSection
                sectionId={section.id}
                dynamicMdContent={dynamicMdContent}
                chatHistories={chatHistories}
              />
            </div>
          </Fragment>
        ))}
        <PageTransition
          lang={path.lang}
          prevPage={prevPage}
          nextPage={nextPage}
        />
        <div />
      </div>
      {isFormVisible ? (
        // leftは sidebarの幅 + 4
        // replがz-10, chatAreaがz-35を使用することからそれの上にするためz-40
        <div className="fixed bottom-4 right-4 left-4 has-sidebar:left-[calc(var(--container-sidebar)+1rem)] z-40">
          <ChatForm
            path={path}
            langName={langEntry?.name ?? ""}
            sectionContent={dynamicMdContent}
            close={() => setIsFormVisible(false)}
          />
        </div>
      ) : (
        <button
          className="fixed bottom-4 right-4 btn btn-soft btn-secondary rounded-full shadow-md z-50"
          onClick={() => setIsFormVisible(true)}
        >
          AIに質問
        </button>
      )}
    </div>
  );
}

export function ChatListForSection(props: {
  dynamicMdContent: DynamicMarkdownSection[];
  sectionId: SectionId;
  chatHistories: ChatWithMessages[];
  fullWidth?: boolean;
}) {
  const { dynamicMdContent, sectionId, chatHistories } = props;
  const filteredChatHistories = chatHistories.filter(
    (c) =>
      c.sectionId === sectionId ||
      // 対象のセクションが存在しないものは、introセクション(index=0)にフォールバックする
      (dynamicMdContent[0].id === sectionId &&
        dynamicMdContent.every((sec) => c.sectionId !== sec.id))
  );

  const chatId = useChatId();

  if (filteredChatHistories.length === 0) {
    // チャットがないなら何も表示しない
    return null;
  }

  return (
    <>
      {/*xl以上の幅かつチャットを表示していない → チャットリストを表示
      see also globals.css
      */}
      <ul
        className={clsx(
          props.fullWidth
            ? "block m-2"
            : clsx(
                chatId === null
                  ? "hidden has-chat-1:block"
                  : "hidden has-chat-2:block",
                "mt-2 ml-4 w-full max-w-chat-list"
              ),
          "menu menu-sm",
          "rounded-lg shadow-sm bg-base-200"
        )}
      >
        <li className="menu-title flex-row items-center gap-1">
          <ChatIcon />
          AIへの質問
          <span className="badge badge-sm badge-soft badge-secondary">
            {filteredChatHistories.length}
          </span>
        </li>
        {filteredChatHistories.map(({ title, chatId }) => (
          <li key={chatId}>
            <Link
              className="text-wrap text-justify"
              href={`/chat/${chatId}`}
              scroll={false}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
      {/*xl未満 or xl以上でチャットを表示している → 小さいボタンを表示*/}
      <details
        className={clsx(
          props.fullWidth
            ? "hidden"
            : clsx(
                chatId === null
                  ? "block has-chat-1:hidden"
                  : "block has-chat-2:hidden",
                "mt-2 ml-2"
              ),
          "dropdown dropdown-end"
        )}
      >
        <summary className="btn btn-outline btn-secondary btn-sm">
          <ChatIcon />
          {filteredChatHistories.length}
        </summary>
        <ul
          className={clsx(
            "menu menu-sm dropdown-content",
            "w-max max-w-[75vw]",
            "z-30",
            "rounded-lg shadow-sm bg-base-200/60 backdrop-blur-xs"
          )}
        >
          {filteredChatHistories.map(({ title, chatId }) => (
            <li key={chatId}>
              <Link
                className="text-wrap text-justify"
                href={`/chat/${chatId}`}
                scroll={false}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}

function ChatIcon() {
  return (
    <>
      {/*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/}
      <svg
        className="w-4 h-4"
        viewBox="3.5 2.5 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.5 12C5.49988 14.613 6.95512 17.0085 9.2741 18.2127C11.5931 19.4169 14.3897 19.2292 16.527 17.726L19.5 18V12C19.5 8.13401 16.366 5 12.5 5C8.63401 5 5.5 8.13401 5.5 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 13.25C9.08579 13.25 8.75 13.5858 8.75 14C8.75 14.4142 9.08579 14.75 9.5 14.75V13.25ZM13.5 14.75C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25V14.75ZM9.5 10.25C9.08579 10.25 8.75 10.5858 8.75 11C8.75 11.4142 9.08579 11.75 9.5 11.75V10.25ZM15.5 11.75C15.9142 11.75 16.25 11.4142 16.25 11C16.25 10.5858 15.9142 10.25 15.5 10.25V11.75ZM9.5 14.75H13.5V13.25H9.5V14.75ZM9.5 11.75H15.5V10.25H9.5V11.75Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}

function OutdatedSectionAlert(props: {
  sectionId: SectionId;
  splitMdContent: SectionWithDiff[];
  chatHistories: ChatWithMessages[];
  path: PagePath;
}) {
  const { sectionId, path } = props;
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  const router = useRouter();

  const handleRegenerateSection = async () => {
    if (
      !confirm(
        "このセクションの全チャットを最新のドキュメントに対して再生成しますか？"
      )
    ) {
      return;
    }

    setIsRegenerating(true);
    setProgress({ current: 0, total: 0 });

    try {
      const response = await fetch("/api/chat/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          sectionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API route error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as RegenerateStreamEvent;
            if (event.type === "progress") {
              setProgress({ current: event.current, total: event.total });
            } else if (event.type === "done") {
              const allChatIds = [
                ...(event.deletedChatIds ?? []),
                ...(event.createdChatIds ?? []),
              ];
              for (const chatId of allChatIds) {
                await revalidateChatAction(chatId, path);
              }
              router.refresh();
            } else if (event.type === "error") {
              throw new Error(
                event.message ?? "Error occurred during regeneration"
              );
            }
          } catch (e) {
            captureException(e);
          }
        }
      }

      router.refresh();
    } catch (err) {
      captureException(err);
      console.error("Failed to regenerate section chats:", err);
      alert("チャットの再生成中にエラーが発生しました。");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="alert flex flex-col items-stretch gap-2">
      <div className="flex items-center justify-between">
        <div className="">
          新しいバージョンのドキュメントがあります。更新するにはチャットを再生成する必要があります。
        </div>
        <button
          className="btn btn-secondary shrink-0"
          onClick={handleRegenerateSection}
          disabled={isRegenerating}
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
      </div>
      {isRegenerating && (
        <progress
          className="progress progress-secondary"
          value={progress.current}
          max={Math.max(1, progress.total)}
        />
      )}
    </div>
  );
}
