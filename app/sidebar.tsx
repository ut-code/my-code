"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pagesList } from "./pagesList";
import { AccountMenu } from "./accountMenu";
import { ThemeToggle } from "./[docs_id]/themeToggle";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DynamicMarkdownSection } from "./[docs_id]/pageContent";
import clsx from "clsx";

export interface ISidebarMdContext {
  loadedDocsId: string;
  sidebarMdContent: DynamicMarkdownSection[];
  setSidebarMdContent: (
    docsId: string,
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
  const [loadedDocsId, setLoadedDocsId] = useState<string>("");
  const setSidebarMdContent = useCallback(
    (
      docsId: string,
      content:
        | DynamicMarkdownSection[]
        | ((prev: DynamicMarkdownSection[]) => DynamicMarkdownSection[])
    ) => {
      setLoadedDocsId(docsId);
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

export function Sidebar() {
  const pathname = usePathname();
  const currentDocsId = pathname.replace(/^\//, ""); // ちょっと遅延がある
  const sidebarContext = useSidebarMdContext();
  // sidebarMdContextの情報が古かったら使わない
  const sidebarMdContent =
    sidebarContext.loadedDocsId === currentDocsId
      ? sidebarContext.sidebarMdContent
      : [];

  // 現在表示中のセクション（最初にinViewがtrueのもの）を見つける
  const currentSectionIndex = sidebarMdContent.findIndex(
    (section, i) => i >= 1 && section.inView
  );

  // 目次の開閉状態
  const [detailsOpen, setDetailsOpen] = useState<boolean[]>([]);
  const currentGroupIndex = pagesList.findIndex((group) =>
    currentDocsId.startsWith(`${group.id}-`)
  );
  useEffect(() => {
    // 表示しているグループが変わったときに現在のグループのdetailsを開く
    if (currentGroupIndex !== -1) {
      setDetailsOpen((detailsOpen) => {
        const newDetailsOpen = [...detailsOpen];
        while (newDetailsOpen.length <= currentGroupIndex) {
          newDetailsOpen.push(false);
        }
        newDetailsOpen[currentGroupIndex] = true;
        return newDetailsOpen;
      });
    }
  }, [currentGroupIndex]);

  return (
    <div className="bg-base-200 h-full w-80 overflow-y-auto">
      <h2 className="hidden lg:flex flex-row items-center p-4 gap-2">
        {/* サイドバーが常時表示されているlg以上の場合のみ */}
        <Link href="/" className="flex-1 flex items-center">
          <img
            src="/icon.svg"
            alt="icon"
            className="inline-block w-8 h-8 mr-2"
          />
          <span className="text-xl font-bold">my.code();</span>
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
              <summary>{group.lang}</summary>
              <ul>
                {group.pages.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`${group.id}-${page.id}`}
                      className={clsx(
                        `${group.id}-${page.id}` === currentDocsId &&
                          "menu-active"
                      )}
                    >
                      <span className="mr-0">{page.id}.</span>
                      {page.title}
                    </Link>
                    {`${group.id}-${page.id}` === currentDocsId &&
                      sidebarMdContent.length > 0 && (
                        <ul className="ml-4 text-sm">
                          {sidebarMdContent.slice(1).map((section, idx) => {
                            // idx + 1 は実際のsectionIndexに対応（slice(1)で最初を除外しているため）
                            const isCurrentSection =
                              idx + 1 === currentSectionIndex;
                            return (
                              <li
                                key={idx}
                                style={{ marginLeft: section.level - 2 + "em" }}
                              >
                                <Link
                                  href={`#${idx + 1}`}
                                  className={
                                    isCurrentSection ? "font-bold" : ""
                                  }
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
