export function Navbar() {
  return (
    <div className="navbar bg-base-200 w-full">
      <div className="flex-none lg:hidden">
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
      <div className="mx-2 flex-1 px-2 font-bold text-xl lg:hidden">
        {/* タイトル(サイドバー非表示の場合のみ) */}
        Navbar Title
      </div>
    </div>
  );
}
