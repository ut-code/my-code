"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR, { Fetcher } from 'swr'
import { splitMarkdown } from "./[docs_id]/splitMarkdown";

const fetcher: Fetcher<string, string> = (url) => fetch(url).then((r) => r.text())

export function Sidebar() {
  const pathname = usePathname();
  const docs_id = pathname.replace(/^\//, "");
  const { data, error, isLoading } = useSWR(
    `/docs/${docs_id}.md`,
    fetcher
  )

  const pages = [
    { id: "python-1", title: "1. 環境構築と基本思想" },
    { id: "python-2", title: "2. 基本構文とデータ型" },
    { id: "python-3", title: "3. リスト、タプル、辞書、セット" },
    { id: "python-4", title: "4. 制御構文と関数" },
    { id: "python-5", title: "5. モジュールとパッケージ" },
    { id: "python-6", title: "6. オブジェクト指向プログラミング" },
    { id: "python-7", title: "7. ファイルの入出力とコンテキストマネージャ" },
    { id: "python-8", title: "8. 例外処理" },
    { id: "python-9", title: "9. ジェネレータとデコレータ" },
  ];

  if (error) return console.error(error)
  if (isLoading) return (
    <div className="bg-base-200 min-h-full w-80 p-4">
      <h2 className="hidden text-xl font-bold mb-4">
        {/* サイドバーが常時表示されている場合のみ */}
        Navbar Title
      </h2>
      <ol className="menu w-full list-outside">
        {pages.map((page) =>
        <li key={page.id}>
          <Link href={`/${page.id}`}>{page.title}</Link>
        </li>
        )}
      </ol>
    </div>
  )

  

  const splitmdcontent = splitMarkdown(data ?? "")
  return (
    <div className="bg-base-200 min-h-full w-80 p-4">
      {/* todo: 背景色ほんとにこれでいい？ */}
      <h2 className="hidden lg:block text-xl font-bold mb-4">
        {/* サイドバーが常時表示されている場合のみ */}
        Navbar Title
      </h2>
      
      <ol className="menu w-full list-outside">
        {pages.map((page) => (
          <li key={page.id}>
            <Link href={`/${page.id}`}>{page.title}</Link>
            {page.id === docs_id && (
              <ul className="ml-4 mt-2 text-sm">
                {splitmdcontent
                  .filter(section => section.level !== 1)
                  .map((section, idx) => (
                    <li key={idx}>{section.title}</li>
                  ))}
              </ul>
            )}

          </li>
        ))}
      </ol>
    </div>
  );
}

