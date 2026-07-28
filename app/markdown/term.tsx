"use client";

import { createContext, JSX, ReactNode, useContext, useState } from "react";
import { ExtraProps } from "react-markdown";
import { onlyText } from "react-children-utilities";
import { LangId, TermDefinition } from "@/lib/docs";
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
  const term = termDefinitions.find((t) => t.term.includes(termText));
  if (!term) {
    console.error(`'${termText}'という用語は定義されていません`);
    return props.children;
  }

  return (
    <>
      <Link
        ref={refs.setReference}
        {...getReferenceProps()}
        href={`/${lang}/${term.page}#${term.id}`}
        className="inline-block link link-info decoration-dotted underline-offset-[0.2rem]"
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
              "max-w-sm rounded-box bg-primary-content/60 border border-primary text-base-content",
              "p-1 shadow-xl backdrop-blur-xs z-50",
              "text-justify"
            )}
          >
            <h6 className="breadcrumbs text-info font-bold flex justify-center text-base wrap-none py-2">
              <ul className="">
                <li>{term.page}</li>
                <li>{term.title}</li>
              </ul>
            </h6>
            <StyledMarkdown content={term.rawContentWithoutCode} />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
