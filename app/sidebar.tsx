import Link from "next/link";

export function Sidebar() {
  return (
    <div className="bg-base-200 min-h-full w-80 p-4">
      {/* todo: 背景色ほんとにこれでいい？ */}
      <h2 className="hidden lg:block text-xl font-bold mb-4">
        {/* サイドバーが常時表示されている場合のみ */}
        Navbar Title
      </h2>
      <ul className="menu w-full">
        <li>
          <Link href="/1">1</Link>
        </li>
      </ul>
    </div>
  );
}
