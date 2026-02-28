"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageEntry } from "@/lib/docs";
import { AccountMenu } from "./accountMenu";
import { ThemeToggle } from "./themeToggle";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DynamicMarkdownSection } from "./[lang]/[pageId]/pageContent";
import clsx from "clsx";
import { LanguageIcon } from "@/terminal/icons";
import { RuntimeLang } from "@my-code/runtime/languages";

export interface ISidebarMdContext {
  loadedDocsId: { lang: string; pageId: string } | null;
  sidebarMdContent: DynamicMarkdownSection[];
  setSidebarMdContent: (
    lang: string,
    pageId: string,
    content:
      | DynamicMarkdownSection[]
      | ((prev: DynamicMarkdownSection[]) => DynamicMarkdownSection[])
  ) => void;
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

export function SidebarMdProvider({ children }: { children: ReactNode }) {
  const [sidebarMdContent, setSidebarMdContent_] = useState<
    DynamicMarkdownSection[]
  >([]);
  const [loadedDocsId, setLoadedDocsId] = useState<{
    lang: string;
    pageId: string;
  } | null>(null);
  const setSidebarMdContent = useCallback(
    (
      lang: string,
      pageId: string,
      content:
        | DynamicMarkdownSection[]
        | ((prev: DynamicMarkdownSection[]) => DynamicMarkdownSection[])
    ) => {
      setLoadedDocsId({ lang, pageId });
      setSidebarMdContent_(content);
    },
    []
  );
  return (
    <SidebarMdContext.Provider
      value={{
        loadedDocsId,
        sidebarMdContent,
        setSidebarMdContent,
      }}
    >
      {children}
    </SidebarMdContext.Provider>
  );
}

export function Sidebar({ pagesList }: { pagesList: LanguageEntry[] }) {
  const pathname = usePathname();
  const pathnameMatch = pathname.match(/^\/([\w-_]+)\/([\w-_]+).*?/);
  const currentLang = pathnameMatch?.[1];
  const currentPageId = pathnameMatch?.[2];
  const sidebarContext = useSidebarMdContext();
  // sidebarMdContextの情報が古かったら使わない
  const sidebarMdContent =
    sidebarContext.loadedDocsId &&
    sidebarContext.loadedDocsId.lang === currentLang &&
    sidebarContext.loadedDocsId.pageId === currentPageId
      ? sidebarContext.sidebarMdContent
      : [];

  // 現在表示中のセクション（最初にinViewがtrueのもの）を見つける
  const currentSectionId = sidebarMdContent.find(
    (section, i) => i >= 1 && section.inView
  )?.id;

  // 目次の開閉状態
  const [detailsOpen, setDetailsOpen] = useState<boolean[]>([]);
  const currentLangIndex = pagesList.findIndex(
    (group) => currentLang === group.id
  );
  useEffect(() => {
    // 表示しているグループが変わったときに現在のグループのdetailsを開く
    if (currentLangIndex !== -1) {
      setDetailsOpen((detailsOpen) => {
        const newDetailsOpen = [...detailsOpen];
        while (newDetailsOpen.length <= currentLangIndex) {
          newDetailsOpen.push(false);
        }
        newDetailsOpen[currentLangIndex] = true;
        return newDetailsOpen;
      });
    }
  }, [currentLangIndex]);

  return (
    <div className="bg-base-200 h-full w-80 overflow-y-auto">
      <h2 className="hidden lg:flex flex-row items-center p-4 gap-2">
        {/* サイドバーが常時表示されているlg以上の場合のみ */}
        <Link href="/" className="flex-1 flex items-center">
          <img
            src="/icon.svg"
            alt="my.code(); Logo"
            className="inline-block w-8 h-8 mr-1"
          />
          <span className="text-xl font-bold font-mono">my.code();</span>
        </Link>
        <ThemeToggle />
        <AccountMenu />
      </h2>
      <span className="block lg:hidden p-4 pb-0">
        <label
          htmlFor="drawer-toggle"
          aria-label="open sidebar"
          className="btn btn-ghost"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 17L13 12L18 7M11 17L6 12L11 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg">Close</span>
        </label>
      </span>

      <ul className="menu w-full">
        {pagesList.map((group, i) => (
          <li key={group.id}>
            <details
              open={!!detailsOpen.at(i)}
              onToggle={(e) => {
                const newDetailsOpen = [...detailsOpen];
                while (newDetailsOpen.length <= i) {
                  newDetailsOpen.push(false);
                }
                newDetailsOpen[i] = e.currentTarget.open;
                setDetailsOpen(newDetailsOpen);
              }}
            >
              <summary>
                <LanguageIcon
                  className="w-4 h-4"
                  lang={group.id as RuntimeLang}
                />
                {group.name}
              </summary>
              <ul>
                {group.pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/${group.id}/${page.slug}`}
                      className={clsx(
                        "text-wrap text-justify",
                        group.id === currentLang &&
                          page.slug === currentPageId &&
                          "menu-active"
                      )}
                    >
                      <span className="w-5 text-right">
                        <span className="float-right">{page.index}.</span>
                      </span>
                      {page.name}
                    </Link>
                    {group.id === currentLang &&
                      page.slug === currentPageId &&
                      sidebarMdContent.length > 0 && (
                        <ul className="ml-4 text-sm">
                          {sidebarMdContent.slice(1).map((section) => {
                            return (
                              <li
                                key={section.id}
                                style={{ marginLeft: section.level - 2 + "em" }}
                              >
                                <Link
                                  href={`#${section.id}`}
                                  className={clsx(
                                    "text-wrap text-justify",
                                    currentSectionId === section.id
                                      ? "font-bold"
                                      : ""
                                  )}
                                >
                                  {section.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
