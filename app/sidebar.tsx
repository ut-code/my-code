"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pagesList } from "./pagesList";
import { AccountMenu } from "./accountMenu";
import { ThemeToggle } from "./[docs_id]/themeToggle";
import { useDynamicMdContext } from "./[docs_id]/dynamicMdContext";

export function Sidebar() {
  const pathname = usePathname();
  const docs_id = pathname.replace(/^\//, "");
  const { dynamicMdContent } = useDynamicMdContext();
  
  // 現在表示中のセクション（最初にinViewがtrueのもの）を見つける
  const currentSectionIndex = dynamicMdContent.findIndex(
    (section) => section.inView
  );
  return (
    <div className="bg-base-200 h-full w-80 overflow-y-auto">
      {/* todo: 背景色ほんとにこれでいい？ */}
      <h2 className="hidden lg:flex flex-row items-center p-4 gap-2">
        {/* サイドバーが常時表示されている場合のみ */}
        <Link href="/" className="flex-1 text-xl font-bold">
          my.code();
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
        {pagesList.map((group) => (
          <li key={group.id}>
            <details open={docs_id.startsWith(`${group.id}-`)}>
              <summary>{group.lang}</summary>
              <ul>
                {group.pages.map((page) => (
                  <li key={page.id}>
                    <Link href={`${group.id}-${page.id}`}>
                      <span className="mr-0">{page.id}.</span>
                      {page.title}
                    </Link>
                    {`${group.id}-${page.id}` === docs_id && dynamicMdContent.length > 0 && (
                      <ul className="ml-4 text-sm">
                        {dynamicMdContent.slice(1).map((section, idx) => {
                          // idx + 1 は実際のsectionIndexに対応（slice(1)で最初を除外しているため）
                          const isCurrentSection = idx + 1 === currentSectionIndex;
                          return (
                            <li
                              key={idx}
                              style={{ marginLeft: section.level - 2 + "em" }}
                            >
                              <Link
                                href={`#${idx + 1}`}
                                className={isCurrentSection ? "font-bold" : ""}
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
