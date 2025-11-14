import Link from "next/link";
import { AccountMenu } from "./accountMenu";
import { ThemeToggle } from "./[docs_id]/themeToggle";
export function Navbar() {
  return (
    <>
      {/* fixedのヘッダーの分だけスクロールするコンテンツを下に移動するためのdiv */}
      <div className="h-16 lg:hidden" />

      <div className="h-16 navbar bg-base-200 w-full fixed lg:hidden flex gap-4 z-40 shadow-md">
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
        <div className="flex-1">
          <Link href="/" className="flex items-center">
            <img
              src="/icon.svg"
              alt="icon"
              className="inline-block w-8 h-8 mr-2"
            />
            <span className="font-bold text-xl font-mono">my.code();</span>
          </Link>
        </div>
        <ThemeToggle />
        <AccountMenu />
      </div>
    </>
  );
}
