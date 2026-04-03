"use client";

import { clearUserCacheAction } from "@/actions/clearUserCache";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ClearCacheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectParam = searchParams.get("redirect") ?? "/";
    // Only allow relative redirects to prevent open redirect attacks
    const redirect = redirectParam.startsWith("/") ? redirectParam : "/";
    clearUserCacheAction()
      .catch(() => {})
      .finally(() => {
        router.replace(redirect);
      });
  }, [router, searchParams]);

  return null;
}

export default function ClearCachePage() {
  return (
    <Suspense>
      <ClearCacheContent />
    </Suspense>
  );
}
