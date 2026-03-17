"use client";

import { PagePath } from "@/lib/docs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function DocsAutoRedirect(props: { path: PagePath }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (pathname === `/chat`) {
      router.replace(`/${props.path.lang}/${props.path.page}`, {
        scroll: false,
      });
    }
  }, [pathname, router, props.path.lang, props.path.page]);

  return null;
}
