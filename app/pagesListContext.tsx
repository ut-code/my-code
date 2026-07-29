"use client";

import { createContext, ReactNode, useContext } from "react";
import { LangId, LanguageEntry } from "./lib/docs";

const PagesListContext = createContext<LanguageEntry[]>(null!);

export function PagesListContextProvider({
  pagesList,
  children,
}: {
  pagesList: LanguageEntry[];
  children: ReactNode;
}) {
  return (
    <PagesListContext.Provider value={pagesList}>
      {children}
    </PagesListContext.Provider>
  );
}

export const usePagesList = () => useContext(PagesListContext);
export function usePagesListForLang(lang?: LangId) {
  const pagesList = useContext(PagesListContext);
  return pagesList.find((p) => p.id === lang);
}
