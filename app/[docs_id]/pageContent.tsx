"use client";

import { useEffect, useRef, useState } from "react";
import { MarkdownSection } from "./splitMarkdown";
import { ChatForm } from "./chatForm";
import { Heading, StyledMarkdown } from "./markdown";
import { useChatHistoryContext } from "./chatHistory";
import { useDynamicMdContext } from "./dynamicMdContext";
import clsx from "clsx";

// MarkdownSectionに追加で、ユーザーが今そのセクションを読んでいるかどうか、などの動的な情報を持たせる
export type DynamicMarkdownSection = MarkdownSection & {
  inView: boolean;
  sectionId: string;
};

interface PageContentProps {
  documentContent: string;
  splitMdContent: MarkdownSection[];
  docs_id: string;
}
export function PageContent(props: PageContentProps) {
  const { dynamicMdContent, setDynamicMdContent } = useDynamicMdContext();

  useEffect(() => {
    // props.splitMdContentが変わったときにdynamicMdContentを更新
    setDynamicMdContent(
      props.splitMdContent.map((section, i) => ({
        ...section,
        inView: false,
        sectionId: `${props.docs_id}-${i}`,
      }))
    );
  }, [props.splitMdContent, props.docs_id, setDynamicMdContent]);

  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  // sectionRefsの長さをsplitMdContentに合わせる
  while (sectionRefs.current.length < props.splitMdContent.length) {
    sectionRefs.current.push(null);
  }

  useEffect(() => {
    const handleScroll = () => {
      setDynamicMdContent((prevDynamicMdContent) => {
        const dynMdContent = prevDynamicMdContent.slice(); // Reactの変更検知のために新しい配列を作成
        for (let i = 0; i < sectionRefs.current.length; i++) {
          if (sectionRefs.current.at(i) && dynMdContent.at(i)) {
            const rect = sectionRefs.current.at(i)!.getBoundingClientRect();
            dynMdContent.at(i)!.inView =
              rect.top < window.innerHeight && rect.bottom >= 0;
          }
        }
        return dynMdContent;
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setDynamicMdContent]);

  const [isFormVisible, setIsFormVisible] = useState(false);

  const { chatHistories } = useChatHistoryContext();

  return (
    <div
      className="p-4 mx-auto grid"
      style={{
        gridTemplateColumns: `1fr auto`,
      }}
    >
      {dynamicMdContent.map((section, index) => (
        <>
          <div
            className="max-w-200"
            key={`${index}-content`}
            id={`${index}`} // 目次からaタグで飛ぶために必要
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
          >
            {/* ドキュメントのコンテンツ */}
            <Heading level={section.level}>{section.title}</Heading>
            <StyledMarkdown content={section.content} />
          </div>
          <div key={`${index}-chat`}>
            {/* 右側に表示するチャット履歴欄 */}
            {chatHistories.filter((c) => c.sectionId === section.sectionId).map(
              ({chatId, messages}) => (
                <div
                  key={chatId}
                  className="max-w-xs mb-2 p-2 text-sm border border-base-content/10 rounded-sm shadow-sm bg-base-100"
                >
                  <div className="max-h-60 overflow-y-auto">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                      >
                        <div
                          className={clsx(
                            "chat-bubble p-1!",
                            msg.role === "user" &&
                              "bg-primary text-primary-content",
                            msg.role === "ai" &&
                              "bg-secondary-content dark:bg-neutral text-black dark:text-white",
                            msg.role === "error" && "chat-bubble-error"
                          )}
                          style={{ maxWidth: "100%", wordBreak: "break-word" }}
                        >
                          <StyledMarkdown content={msg.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </>
      ))}
      {isFormVisible ? (
        // sidebarの幅が80であることからleft-84 (sidebar.tsx参照)
        // replがz-10を使用することからそれの上にするためz-20
        <div className="fixed bottom-4 right-4 left-4 lg:left-84 z-20">
          <ChatForm
            documentContent={props.documentContent}
            sectionContent={dynamicMdContent}
            docs_id={props.docs_id}
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
