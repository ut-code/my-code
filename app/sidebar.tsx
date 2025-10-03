"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR, { Fetcher } from "swr";
import { splitMarkdown } from "./[docs_id]/splitMarkdown";
import { pagesList } from "./pagesList";
import { ThemeToggle } from "./[docs_id]/themeToggle";

const fetcher: Fetcher<string, string> = (url) =>
  fetch(url).then((r) => r.text());

export function Sidebar() {
  const pathname = usePathname();
  const docs_id = pathname.replace(/^\//, "");
  const { data, error, isLoading } = useSWR(`/docs/${docs_id}.md`, fetcher);
  
  if (error) console.error("Sidebar fetch error:", error);

  const splitmdcontent = splitMarkdown(data ?? "");
  return (
    <div className="bg-base-200 h-full w-80 overflow-y-auto">
      {/* todo: 背景色ほんとにこれでいい？ */}
      <h2 className="hidden lg:flex flex-row items-center text-xl font-bold p-4">
        {/* サイドバーが常時表示されている場合のみ */}
        <span className="flex-1">Navbar Title</span>
        <ThemeToggle />
      </h2>

      

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
