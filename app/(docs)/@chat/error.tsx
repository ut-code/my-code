"use client"; // Error boundaries must be Client Components

import clsx from "clsx";
import { ChatAreaContainer } from "./chat/[chatId]/chatArea";
import { useEffect } from "react";
import { captureException } from "@sentry/nextjs";

export default function Error({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <ChatAreaContainer chatId={"error"}>
      <p>ページの読み込み中にエラーが発生しました。</p>
      <pre
        className={clsx(
          "border-2 border-current/20 mt-4 rounded-box p-4! bg-base-300! text-base-content!",
          "max-w-full whitespace-pre-wrap"
        )}
      >
        {error.message}
      </pre>
      {error.digest && (
        <p className="mt-2 text-sm text-base-content/50">
          Digest: {error.digest}
        </p>
      )}
    </ChatAreaContainer>
  );
}
