"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ChatForm } from "./chatForm";
import { Heading, StyledMarkdown } from "./markdown";
import { useChatHistoryContext } from "./chatHistory";
import { useSidebarMdContext } from "@/sidebar";
import clsx from "clsx";
import { PageTransition } from "./pageTransition";
import {
  LanguageEntry,
  MarkdownSection,
  PageEntry,
  PagePath,
} from "@/lib/docs";

/**
 * MarkdownSectionに追加で、動的な情報を持たせる
 */
export type DynamicMarkdownSection = MarkdownSection & {
  /**
   * ユーザーが今そのセクションを読んでいるかどうか
   */
  inView: boolean;
  /**
   * チャットの会話を元にAIが書き換えた後の内容
   */
  replacedContent: string;
};

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
    const newContent = splitMdContent.map((section) => ({
      ...section,
      inView: false,
      replacedContent: section.rawContent,
    }));
    const chatDiffs = chatHistories.map((chat) => chat.diff).flat();
    chatDiffs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    for (const diff of chatDiffs) {
      const targetSection = newContent.find((s) => s.id === diff.sectionId);
      if (targetSection) {
        if (targetSection.replacedContent.includes(diff.search)) {
          targetSection.replacedContent = targetSection.replacedContent.replace(
            diff.search,
            diff.replace
          );
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
    <div
      className="p-4 mx-auto max-w-full grid"
      style={{
        gridTemplateColumns: `1fr auto`,
      }}
    >
      <Heading level={1}>
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
            <StyledMarkdown content={section.replacedContent} />
          </div>
          <div>
            {/* 右側に表示するチャット履歴欄 */}
            {chatHistories
              .filter(
                (c) =>
                  c.sectionId === section.id ||
                  // 対象のセクションが存在しないものは、introセクション(index=0)にフォールバックする
                  (index === 0 &&
                    dynamicMdContent.every((sec) => c.sectionId !== sec.id))
              )
              .map(({ chatId, messages }) => (
                <div
                  key={chatId}
                  className="max-w-xs mb-2 p-2 text-sm border border-base-content/10 rounded-sm shadow-sm bg-base-200"
                >
                  <div className="max-h-60 overflow-y-auto">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                      >
                        <div
                          className={clsx(
                            msg.role === "user" &&
                              "chat-bubble p-0.5! bg-secondary/30",
                            msg.role === "ai" && "chat-bubble p-0.5!",
                            msg.role === "error" && "text-error"
                          )}
                          style={{ maxWidth: "100%", wordBreak: "break-word" }}
                        >
                          <StyledMarkdown content={msg.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Fragment>
      ))}
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
