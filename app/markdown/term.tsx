"use client";

import { createContext, JSX, ReactNode, useContext } from "react";
import { ExtraProps } from "react-markdown";
import { onlyText } from "react-children-utilities";
import { LangId, TermDefinition } from "@/lib/docs";
import Link from "next/link";
import { StyledMarkdown } from "./markdown";

const TermDefinitionContext = createContext<{
  lang: LangId;
  termDefinitions: TermDefinition[];
} | null>(null);
export function TermDefinitionProvider({
  lang,
  termDefinitions,
  children,
}: {
  lang: LangId;
  termDefinitions: TermDefinition[];
  children: ReactNode;
}) {
  return (
    <TermDefinitionContext.Provider value={{ lang, termDefinitions }}>
      {children}
    </TermDefinitionContext.Provider>
  );
}

/**
 * https://github.com/ut-code/utcode-learn/blob/main/src/components/Term/index.tsx をもとに独自実装
 * Copyright (c) 2023 ut.code();
 */
export default function Term(props: JSX.IntrinsicElements["q"] & ExtraProps) {
  // termDefinitionの取得がasync関数であり、clientコンポーネントから直接取得できないので、
  // @docs/lang/pageId/page.tsx で取得したものをcontextに渡してそれを取得する
  const { lang, termDefinitions } = useContext(TermDefinitionContext) ?? {};

  if (!termDefinitions) {
    return props.children;
  }

  const termText = onlyText(props.children);
  const term = termDefinitions.find((t) => t.term.includes(termText));
  if (!term) {
    console.error(`'${termText}'という用語は定義されていません`);
    return props.children;
  }

  // [{props.children} → term:{onlyText(props.children)}]

  return (
    <span className="tooltip tooltip-primary">
      <span className="tooltip-content bg-primary-content/60 border border-primary text-base-content backdrop-blur-xs">
        <span className="breadcrumbs text-info text-center text-base wrap-none mb-4">
          <ul className="">
            <li>{term.page}</li>
            <li>{term.title}</li>
          </ul>
        </span>
        <StyledMarkdown content={term.rawContentWithoutCode} />
      </span>
      <Link
        href={`/${lang}/${term.page}#${term.id}`}
        className="link link-info decoration-dotted underline-offset-[0.2rem]"
      >
        {props.children}
      </Link>
    </span>
  );
}
