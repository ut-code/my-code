"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "./section";
import { MarkdownSection } from "./splitMarkdown";
import { ChatForm } from "./chatForm";

interface PageContentProps {
  splitMdContent: MarkdownSection[];
  docs_id: string;
}
export function PageContent(props: PageContentProps) {
  // 各セクションが画面内にあるかどうかを調べる
  const [sectionInView, setSectionInView] = useState<boolean[]>([]);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  // sectionRefsの長さをsplitMdContentに合わせる
  while (sectionRefs.current.length < props.splitMdContent.length) {
    sectionRefs.current.push(null);
  }
  sectionRefs.current = sectionRefs.current.slice(
    0,
    props.splitMdContent.length
  );

  useEffect(() => {
    const handleScroll = () => {
      const newSectionInView = sectionRefs.current.map((sectionRef) => {
        if (sectionRef) {
          const rect = sectionRef.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom >= 0;
        }
        return false;
      });
      setSectionInView(newSectionInView);
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
      {props.splitMdContent.map((section, index) => {
        const sectionId = `${props.docs_id}-${index}`;
        return (
          <div
            key={index}
            id={`${index}`} // 目次からaタグで飛ぶために必要
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
          >
            <Section section={section} sectionId={sectionId} />
          </div>
        );
      })}
      {isFormVisible ? (
        <div className="fixed bottom-4 inset-x-4 z-50">
          <ChatForm
            splitMdContent={props.splitMdContent}
            sectionInView={sectionInView}
            docs_id={props.docs_id}
            onClose={() => setIsFormVisible(false)}
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
