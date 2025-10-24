"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "./section";
import { MarkdownSection } from "./splitMarkdown";
import { ChatForm } from "./chatForm";

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
  const [dynamicMdContent, setDynamicMdContent] = useState<
    DynamicMarkdownSection[]
  >(
    // useEffectで更新するのとは別に、SSRのための初期値
    props.splitMdContent.map((section, i) => ({
      ...section,
      inView: false,
      sectionId: `${props.docs_id}-${i}`,
    }))
  );
  useEffect(() => {
    // props.splitMdContentが変わったときにdynamicMdContentを更新
    setDynamicMdContent(
      props.splitMdContent.map((section, i) => ({
        ...section,
        inView: false,
        sectionId: `${props.docs_id}-${i}`,
      }))
    );
  }, [props.splitMdContent, props.docs_id]);

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
  }, []);

  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="p-4">
      {dynamicMdContent.map((section, index) => 
          <div
            key={index}
            id={`${index}`} // 目次からaタグで飛ぶために必要
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
          >
            <Section section={section} sectionId={section.sectionId} />
          </div>
      )}
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
