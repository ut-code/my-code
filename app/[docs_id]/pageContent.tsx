"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "./section";
import { MarkdownSection } from "./splitMarkdown";

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

  return props.splitMdContent.map((section, index) => {
    const sectionId = `${props.docs_id}-${index}`;
    return (
      <div
        key={index}
        id={`${index}`}  // 目次からaタグで飛ぶために必要
        ref={(el) => {
          sectionRefs.current[index] = el;
        }}
      >
        <Section section={section} sectionId={sectionId} />
      </div>
    );
  });
}
