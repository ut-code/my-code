"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ChatForm } from "./chatForm";
import { StyledMarkdown } from "@/markdown/markdown";
import { useChatHistoryContext } from "./chatHistory";
import { useSidebarMdContext } from "@/sidebar";
import clsx from "clsx";
import { PageTransition } from "./pageTransition";
import {
  LanguageEntry,
  MarkdownSection,
  PageEntry,
  PagePath,
  SectionId,
} from "@/lib/docs";
import { ReplacedRange } from "@/markdown/multiHighlight";
import { Heading } from "@/markdown/heading";
import Link from "next/link";
import { useChatId } from "@/(docs)/chatAreaState";

/**
 * MarkdownSectionに追加で、動的な情報を持たせる
 */
export interface DynamicMarkdownSection extends MarkdownSection {
  /**
   * ユーザーが今そのセクションを読んでいるかどうか
   */
  inView: boolean;
  /**
   * チャットの会話を元にAIが書き換えた後の内容
   */
  replacedContent: string;
  replacedRange: ReplacedRange[];
}

interface PageContentProps {
  splitMdContent: MarkdownSection[];
  langEntry: LanguageEntry;
  pageEntry: PageEntry;
  prevPage?: PageEntry;
  nextPage?: PageEntry;
  path: PagePath;
}
export function PageContent(props: PageContentProps) {
  const { setSidebarMdContent } = useSidebarMdContext();
  const { splitMdContent, pageEntry, path } = props;

  const { chatHistories } = useChatHistoryContext();

  const initDynamicMdContent = useCallback(() => {
    const newContent: DynamicMarkdownSection[] = splitMdContent.map(
      (section) => ({
        ...section,
        inView: false,
        replacedContent: section.rawContent,
        replacedRange: [],
      })
    );
    const chatDiffs = chatHistories.map((chat) => chat.diff).flat();
    chatDiffs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    for (const diff of chatDiffs) {
      const targetSection = newContent.find((s) => s.id === diff.sectionId);
      if (targetSection) {
        const startIndex = targetSection.replacedContent.indexOf(diff.search);
        if (startIndex !== -1) {
          const endIndex = startIndex + diff.search.length;
          const replaceLen = diff.replace.length;
          const diffLen = replaceLen - diff.search.length; // 文字列長の増減分

          // 1. 文字列の置換
          targetSection.replacedContent =
            targetSection.replacedContent.slice(0, startIndex) +
            diff.replace +
            targetSection.replacedContent.slice(endIndex);

          // 2. 既存のハイライト範囲のズレを補正（今回の置換箇所より後ろにあるものをシフト）
          targetSection.replacedRange = targetSection.replacedRange.map((h) => {
            if (h.start >= endIndex) {
              // 完全に後ろにある場合は単純にシフト
              return {
                start: h.start + diffLen,
                end: h.end + diffLen,
                id: h.id,
              };
            }
            if (h.end >= endIndex) {
              return { start: h.start, end: h.end + diffLen, id: h.id };
            }
            return h;
          });

          // 3. 今回の置換箇所を新たなハイライト範囲として追加
          targetSection.replacedRange.push({
            start: startIndex,
            end: startIndex + replaceLen,
            id: diff.chatId,
          });
        } else {
          // TODO: md5ハッシュを参照し過去バージョンのドキュメントへ適用を試みる
          console.error(
            `Failed to apply diff: search string "${diff.search}" not found in section ${targetSection.id}`
          );
        }
      } else {
        console.error(
          `Failed to apply diff: section with id "${diff.sectionId}" not found`
        );
      }
    }

    return newContent;
  }, [splitMdContent, chatHistories]);

  // SSR用のローカルstate
  const [dynamicMdContent, setDynamicMdContent] = useState<
    DynamicMarkdownSection[]
  >(() => initDynamicMdContent());

  useEffect(() => {
    // props.splitMdContentが変わったとき, チャットのdiffが変わった時に
    // ローカルstateとcontextの両方を更新
    const newContent = initDynamicMdContent();
    setDynamicMdContent(newContent);
    setSidebarMdContent(path, newContent);
  }, [initDynamicMdContent, path, setSidebarMdContent]);

  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  // sectionRefsの長さをsplitMdContentに合わせる
  while (sectionRefs.current.length < props.splitMdContent.length) {
    sectionRefs.current.push(null);
  }

  useEffect(() => {
    const handleScroll = () => {
      const updateContent = (
        prevDynamicMdContent: DynamicMarkdownSection[]
      ) => {
        const dynMdContent = prevDynamicMdContent.slice(); // Reactの変更検知のために新しい配列を作成
        for (let i = 0; i < sectionRefs.current.length; i++) {
          if (sectionRefs.current.at(i) && dynMdContent.at(i)) {
            const rect = sectionRefs.current.at(i)!.getBoundingClientRect();
            dynMdContent.at(i)!.inView =
              rect.top < window.innerHeight * 0.9 &&
              rect.bottom >= window.innerHeight * 0.1;
          }
        }
        return dynMdContent;
      };

      // ローカルstateとcontextの両方を更新
      setDynamicMdContent(updateContent);
      setSidebarMdContent(path, updateContent);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setSidebarMdContent, path]);

  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="flex-1 p-4 flex flex-col">
      <div
        className="max-w-full mx-auto grid"
        style={{
          gridTemplateColumns: `1fr auto`,
        }}
      >
        <Heading className="max-w-200" level={1}>
          第{pageEntry.index}章: {pageEntry.title}
        </Heading>
        <div />
        {dynamicMdContent.map((section, index) => (
          <Fragment key={section.id}>
            <div
              className="min-w-1/2 max-w-200 text-justify"
              id={section.id} // 目次からaタグで飛ぶために必要
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
            >
              {/* ドキュメントのコンテンツ */}
              <StyledMarkdown
                content={section.replacedContent}
                replacedRange={section.replacedRange}
              />
            </div>
            <div>
              <ChatListForSection
                sectionId={section.id}
                dynamicMdContent={dynamicMdContent}
              />
            </div>
          </Fragment>
        ))}
      </div>
      <PageTransition
        lang={path.lang}
        prevPage={props.prevPage}
        nextPage={props.nextPage}
      />
      {isFormVisible ? (
        // sidebarの幅が80であることからleft-84 (sidebar.tsx参照)
        // replがz-10を使用することからそれの上にするためz-20
        <div className="fixed bottom-4 right-4 left-4 lg:left-84 z-20">
          <ChatForm
            path={path}
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

function ChatListForSection(props: {
  dynamicMdContent: DynamicMarkdownSection[];
  sectionId: SectionId;
}) {
  const { chatHistories } = useChatHistoryContext();
  const { dynamicMdContent, sectionId } = props;
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
      {/*PC表示かつチャットを表示していない → チャットリストを表示*/}
      <ul
        className={clsx(
          chatId === null ? "hidden lg:block" : "hidden",
          "mt-2 ml-4 max-w-60",
          "menu menu-sm",
          "border border-base-content/10 rounded-sm shadow-sm bg-base-200"
        )}
      >
        <li className="menu-title">チャット</li>
        {filteredChatHistories.map(({ chatId }) => (
          <li key={chatId} className="">
            <Link className="link link-info" href={`/chat/${chatId}`}>
              {chatId}
            </Link>
          </li>
        ))}
      </ul>
      {/*PCでない or PC表示でチャットを表示している → 小さい吹き出しを表示*/}
      <details
        className={clsx(
          chatId === null ? "block lg:hidden" : "block",
          "dropdown dropdown-end",
          "mt-2 ml-2"
        )}
      >
        <summary className="btn btn-outline btn-secondary btn-sm">
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
          {filteredChatHistories.length}
        </summary>
        <ul
          className={clsx(
            "menu menu-sm dropdown-content",
            "w-max max-w-[75vw]",
            "border border-base-content/10 rounded-sm shadow-sm bg-base-200"
          )}
        >
          {filteredChatHistories.map(({ chatId }) => (
            <li key={chatId} className="">
              <Link className="link link-info" href={`/chat/${chatId}`}>
                {chatId}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
