import Link from "next/link";
import { PageEntry } from "@/lib/docs";

interface PageTransitionProps {
  lang: string;
  prevPage?: PageEntry;
  nextPage?: PageEntry;
}

export function PageTransition({ lang, prevPage, nextPage }: PageTransitionProps) {
  return (
    <div className="flex justify-between gap-4 mt-12 pt-8 border-t border-base-content/10 min-w-1/2 max-w-200 col-span-2">
      <div className="flex-1 flex">
        {prevPage && (
          <Link
            href={`/${lang}/${prevPage.slug}`}
            className="group flex-1 btn btn-ghost border-2 border-base-content/20 hover:border-yellow-400 flex flex-col items-start h-auto py-2 normal-case text-left"
          >
            <span className="text-xs text-base-content/60 font-normal group-hover:text-yellow-400">前のページ</span>
            <span className="text-sm md:text-base group-hover:text-yellow-400">&laquo; {prevPage.name}</span>
          </Link>
        )}
      </div>
      <div className="flex-1 flex">
        {nextPage && (
          <Link
            href={`/${lang}/${nextPage.slug}`}
            className="group flex-1 btn btn-ghost border-2 border-base-content/20 hover:border-yellow-400 flex flex-col items-end h-auto py-2 normal-case text-right"
          >
            <span className="text-xs text-base-content/60 font-normal group-hover:text-yellow-400">次のページ</span>
            <span className="text-sm md:text-base group-hover:text-yellow-400">{nextPage.name} &raquo;</span>
          </Link>
        )}
      </div>
    </div>
  );
}
