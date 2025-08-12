import Link from "next/link";

export function Sidebar() {
  return (
    <div className="bg-base-200 min-h-full w-80 p-4">
      {/* todo: 背景色ほんとにこれでいい？ */}
      <h2 className="hidden lg:block text-xl font-bold mb-4">
        {/* サイドバーが常時表示されている場合のみ */}
        Navbar Title
      </h2>
      <ol className="menu w-full list-decimal list-outside">
        <li>
          <Link href="/python-1">1. 環境構築と基本思想</Link>
        </li>
        <li>
          <Link href="/python-2">2. 基本構文とデータ型</Link>
        </li>
        <li>
          <Link href="/python-3">3. リスト、タプル、辞書、セット</Link>
        </li>
        <li>
          <Link href="/python-4">4. 制御構文と関数</Link>
        </li>
        <li>
          <Link href="/python-5">5. モジュールとパッケージ</Link>
        </li>
        <li>
          <Link href="/python-6">6. オブジェクト指向プログラミング</Link>
        </li>
        <li>
          <Link href="/python-7">7. ファイルの入出力とコンテキストマネージャ</Link>
        </li>
        <li>
          <Link href="/python-8">8. 例外処理</Link>
        </li>
        <li>
          <Link href="/python-9">9. ジェネレータとデコレータ</Link>
        </li>
      </ol>
    </div>
  );
}
