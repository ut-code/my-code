"use client";

import { ReactNode } from "react";
import { type MarkdownSection } from "./splitMarkdown";
import { StyledMarkdown } from "./markdown";

interface SectionProps {
  section: MarkdownSection;
  sectionId: string;
}

// 1つのセクションのタイトルと内容を表示する。内容はMarkdownとしてレンダリングする
export function Section({ section, sectionId }: SectionProps) {
  return (
    <>
      <Heading level={section.level}>{section.title}</Heading>
      <StyledMarkdown content={section.content} />
    </>
  );
}

export function Heading({
  level,
  children,
}: {
  level: number;
  children: ReactNode;
}) {
  switch (level) {
    case 1:
      return <h1 className="text-2xl font-bold my-4">{children}</h1>;
    case 2:
      return <h2 className="text-xl font-bold mt-4 mb-3 ">{children}</h2>;
    case 3:
      return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
    case 4:
      return <h4 className="text-base font-bold mt-3 mb-2">{children}</h4>;
    case 5:
      // TODO: これ以下は4との差がない (全体的に大きくする必要がある？)
      return <h5 className="text-base font-bold mt-3 mb-2">{children}</h5>;
    case 6:
      return <h6 className="text-base font-bold mt-3 mb-2">{children}</h6>;
  }
}
