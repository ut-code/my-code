"use client";

import Link from "next/link";
import { AccountMenu } from "./accountMenu";
import { ThemeToggle } from "./themeToggle";
import { usePathname } from "next/navigation";
import { LanguageEntry } from "@/lib/docs";

function PageTitle({ pagesList }: { pagesList: LanguageEntry[] }) {
  const pathname = usePathname();
  const pathnameMatch = pathname.match(/^\/([\w-_]+)\/([\w-_]+).*?/);
  const currentLang = pathnameMatch?.[1];
  const currentPageId = pathnameMatch?.[2];

  if(pathname === "/"){
    return <>へようこそ</>;
  }

  const currentGroup = pagesList.find((group) => group.id === currentLang);
  const currentPage = currentGroup?.pages.find((page) => page.slug === currentPageId);
  if(currentGroup && currentPage){
    return <>
      <span className="text-base mr-2">{currentGroup.name}-{currentPage.index}.</span>
      <span>{currentPage.name}</span>
    </>
  }

  return null;
}
export function Navbar({ pagesList }: { pagesList: LanguageEntry[] }) {

  return (
    <>
      {/* fixedのヘッダーの分だけスクロールするコンテンツを下に移動するためのdiv */}
      <div className="h-16 lg:hidden" />

      <div className="h-16 navbar bg-base-300/60 w-full fixed lg:hidden flex gap-4 z-40 shadow-md backdrop-blur-xs">
        <div className="flex-none">
          {/* サイドバーを開閉するボタン */}
          <label
            htmlFor="drawer-toggle"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>
        {/* サイドバーが表示されていない場合のみ */}
        <Link href="/" className="flex items-center">
          <img
            src="/icon.svg"
            alt="my.code(); Logo"
            className="inline-block w-8 h-8 mr-2"
          />
          <span className="font-bold text-xl font-mono">my.code();</span>
        </Link>
        <div className="flex-1 hidden md:inline text-nowrap overflow-hidden text-ellipsis font-bold text-xl">
          <PageTitle pagesList={pagesList} />
        </div>
        <div className="flex-1 md:hidden" />
        <ThemeToggle />
        <AccountMenu />
      </div>
    </>
  );
}
