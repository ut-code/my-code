"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR, { Fetcher } from "swr";
import { splitMarkdown } from "./[docs_id]/splitMarkdown";

const fetcher: Fetcher<string, string> = (url) =>
  fetch(url).then((r) => r.text());

export function Sidebar() {
  const pathname = usePathname();
  const docs_id = pathname.replace(/^\//, "");
  const { data, error, isLoading } = useSWR(`/docs/${docs_id}.md`, fetcher);

  const pages = [
    {
      id: "python",
      lang: "Python",
      pages: [
        { id: 1, title: "環境構築と基本思想" },
        { id: 2, title: "基本構文とデータ型" },
        { id: 3, title: "リスト、タプル、辞書、セット" },
        { id: 4, title: "制御構文と関数" },
        { id: 5, title: "モジュールとパッケージ" },
        { id: 6, title: "オブジェクト指向プログラミング" },
        {
          id: 7,
          title: "ファイルの入出力とコンテキストマネージャ",
        },
        { id: 8, title: "例外処理" },
        { id: 9, title: "ジェネレータとデコレータ" },
      ],
    },
    {
      id: "cpp",
      lang: "C++",
      pages: [
        { id: 2, title: "型システムとメモリ" },
        { id: 3, title: "関数と参照" },
      ],
    },
  ];

  if (error) console.error("Sidebar fetch error:", error);

  const splitmdcontent = splitMarkdown(data ?? "");
  return (
    <div className="bg-base-200 h-full w-80 overflow-y-auto">
      {/* todo: 背景色ほんとにこれでいい？ */}
      <h2 className="hidden lg:block text-xl font-bold p-4">
        {/* サイドバーが常時表示されている場合のみ */}
        Navbar Title
      </h2>

      <ul className="menu w-full">
        {pages.map((group) => (
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
                    {`${group.id}-${page.id}` === docs_id && !isLoading && (
                      <ul className="ml-4 text-sm">
                        {splitmdcontent.slice(1).map((section, idx) => (
                          <li
                            key={idx}
                            style={{ marginLeft: section.level - 2 + "em" }}
                          >
                            <Link href={`#${idx + 1}`}>{section.title}</Link>
                          </li>
                        ))}
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
