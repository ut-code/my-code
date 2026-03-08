import Link from "next/link";
import { PageEntry } from "@/lib/docs";

interface PageTransitionProps {
  lang: string;
  prevPage: PageEntry;
  nextPage: PageEntry;
}

export function PageTransition({ lang, prevPage, nextPage }: PageTransitionProps) {
  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-base-content/10 w-full col-span-2">
      <div>
        {prevPage && (
          <Link
            href={`/${lang}/${prevPage.slug}`}
            className="btn btn-ghost border-base-content/20 flex flex-col items-start h-auto py-2 normal-case"
          >
            <span className="text-xs text-base-content/60 font-normal">前のページ</span>
            <span className="text-sm md:text-base">&laquo; {prevPage.title}</span>
          </Link>
        )}
      </div>
      <div>
        {nextPage && (
          <Link
            href={`/${lang}/${nextPage.slug}`}
            className="btn btn-ghost border-base-content/20 flex flex-col items-end h-auto py-2 normal-case text-right"
          >
            <span className="text-xs text-base-content/60 font-normal">次のページ</span>
            <span className="text-sm md:text-base">{nextPage.title} &raquo;</span>
          </Link>
        )}
      </div>
    </div>
  );
}
