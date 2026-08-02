"use client";

import { createContext, JSX, ReactNode, useContext, useState } from "react";
import { ExtraProps } from "react-markdown";
import { onlyText } from "react-children-utilities";
import { LangId, PageEntry, PageSlug, TermDefinition } from "@/lib/docs";
import Link from "next/link";
import { StyledMarkdown } from "./markdown";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import clsx from "clsx";
import { usePagesListForLang } from "@/pagesListContext";
import { WithAutoTooltipPosition } from "./tooltipPosition";

const TermDefinitionContext = createContext<{
  lang: LangId;
  page: PageSlug;
  termDefinitions: TermDefinition[];
} | null>(null);
export function TermDefinitionProvider({
  lang,
  page,
  termDefinitions,
  children,
}: {
  lang: LangId;
  page: PageSlug;
  termDefinitions: TermDefinition[];
  children: ReactNode;
}) {
  return (
    <TermDefinitionContext.Provider value={{ lang, page, termDefinitions }}>
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
  const { lang, page, termDefinitions } =
    useContext(TermDefinitionContext) ?? {};

  const langEntry = usePagesListForLang(lang);

  // 1. Manage the tooltip's open state
  const [isOpen, setIsOpen] = useState(false);

  // 2. Setup Floating UI
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top", // Preferred placement
    // Make sure the tooltip stays anchored to the trigger when scrolling/resizing
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(2), // Gap between trigger and tooltip
      flip(), // Flip to bottom if no space on top
      shift(), // Keep tooltip on screen
    ],
  });

  // 3. Setup interactions (trigger on hover, focus, and dismiss on click outside/escape)
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  // Merge the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  if (!termDefinitions) {
    return props.children;
  }

  const termText = onlyText(props.children);
  const term = termDefinitions.find((t) => t.alias.includes(termText));
  if (!term) {
    const internalLink = (pageEntry: PageEntry) => (
      <WithAutoTooltipPosition
        as={Link}
        className="link link-info decoration-dotted tooltip tooltip-info before:z-100"
        data-tip={`${pageEntry.index}. ${pageEntry.name}`}
        href={`/${lang}/${pageEntry.slug}`}
      >
        第{pageEntry.index}章
      </WithAutoTooltipPosition>
    );

    // ./1, ./1-foo, ./next, ./prev →同じ言語のドキュメントへのリンクで、「第n章」
    const pageIndexMatch = termText.match(/^\.\/(\d+)$/);
    const pageSlugMatch = termText.match(/^\.\/([0-9a-zA-Z_-]+)$/);
    if (
      pageIndexMatch &&
      langEntry &&
      Number(pageIndexMatch[1]) < langEntry.pages.length
    ) {
      return internalLink(langEntry.pages[Number(pageIndexMatch[1])]);
    }
    if (
      pageSlugMatch &&
      langEntry?.pages.find((p) => p.slug === pageSlugMatch[1])
    ) {
      return internalLink(
        langEntry.pages.find((p) => p.slug === pageSlugMatch[1])!
      );
    }
    const currentPageIndex =
      langEntry?.pages.findIndex((p) => p.slug === page) ?? -1;
    if (
      pageSlugMatch &&
      langEntry &&
      pageSlugMatch[1] === "prev" &&
      currentPageIndex > 0
    ) {
      // ./prev → 前のページ
      return internalLink(langEntry.pages[currentPageIndex - 1]);
    }
    if (
      pageSlugMatch &&
      langEntry &&
      pageSlugMatch[1] === "next" &&
      currentPageIndex >= 0 &&
      currentPageIndex < langEntry.pages.length - 1
    ) {
      // ./next → 次のページ
      return internalLink(langEntry.pages[currentPageIndex + 1]);
    }

    console.error(`'${termText}' という用語は定義されていません`);
    return (
      <WithAutoTooltipPosition
        as="span"
        className="link link-error decoration-dotted tooltip tooltip-error before:z-100"
        data-tip={`'${termText}' という用語は定義されていません`}
      >
        {props.children}
      </WithAutoTooltipPosition>
    );
  }

  const pageEntry = langEntry?.pages.find((p) => p.slug === term.page);

  return (
    <>
      <Link
        ref={refs.setReference}
        {...getReferenceProps()}
        href={`/${lang}/${term.page}#${term.id}`}
        className="link link-info decoration-dotted"
      >
        {props.children}
      </Link>
      {isOpen && (
        <FloatingPortal>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={clsx(
              "max-w-sm rounded-box bg-base-100/60 border border-info text-base-content",
              "p-1 shadow-xl backdrop-blur-xs z-100",
              "text-justify text-sm"
            )}
          >
            <div
              className={clsx(
                // 内容がはみ出る場合、フェードアウトする
                "max-h-(--container-sm) overflow-clip",
                "mask-b-from-[calc(var(--container-sm)*0.85)] mask-b-to-[calc(var(--container-sm)*1.0)]"
              )}
            >
              <h6 className="breadcrumbs text-info font-bold flex justify-center text-sm wrap-none py-2">
                <ul className="flex-wrap justify-center">
                  <li>
                    {pageEntry?.index}. {pageEntry?.name}
                  </li>
                  <li>{term.title}</li>
                </ul>
              </h6>
              <StyledMarkdown content={term.rawContentWithoutCode} />
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
