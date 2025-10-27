"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { DynamicMarkdownSection } from "./pageContent";

export interface ISidebarMdContext {
  sidebarMdContent: DynamicMarkdownSection[];
  setSidebarMdContent: React.Dispatch<React.SetStateAction<DynamicMarkdownSection[]>>;
}

const SidebarMdContext = createContext<ISidebarMdContext | null>(null);

export function useSidebarMdContext() {
  const context = useContext(SidebarMdContext);
  if (!context) {
    throw new Error(
      "useSidebarMdContext must be used within a SidebarMdProvider"
    );
  }
  return context;
}

export function useSidebarMdContextOptional() {
  return useContext(SidebarMdContext);
}

export function SidebarMdProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarMdContent, setSidebarMdContent] =
    useState<DynamicMarkdownSection[]>([]);

  return (
    <SidebarMdContext.Provider value={{ sidebarMdContent, setSidebarMdContent }}>
      {children}
    </SidebarMdContext.Provider>
  );
}
