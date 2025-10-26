"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { DynamicMarkdownSection } from "./pageContent";

export interface IDynamicMdContext {
  dynamicMdContent: DynamicMarkdownSection[];
  setDynamicMdContent: React.Dispatch<React.SetStateAction<DynamicMarkdownSection[]>>;
}

const DynamicMdContext = createContext<IDynamicMdContext | null>(null);

export function useDynamicMdContext() {
  const context = useContext(DynamicMdContext);
  if (!context) {
    throw new Error(
      "useDynamicMdContext must be used within a DynamicMdProvider"
    );
  }
  return context;
}

export function useDynamicMdContextOptional() {
  return useContext(DynamicMdContext);
}

export function DynamicMdProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent: DynamicMarkdownSection[];
}) {
  const [dynamicMdContent, setDynamicMdContent] =
    useState<DynamicMarkdownSection[]>(initialContent);

  return (
    <DynamicMdContext.Provider value={{ dynamicMdContent, setDynamicMdContent }}>
      {children}
    </DynamicMdContext.Provider>
  );
}
