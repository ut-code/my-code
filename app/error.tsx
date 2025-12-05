"use client"; // Error boundaries must be Client Components

import clsx from "clsx";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 flex-1 w-max max-w-full mx-auto flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">エラー</h1>
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
      <div className="divider w-full self-auto!" />
      <div className="flex flex-row gap-4">
        <button
          className="btn btn-warning"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          やりなおす
        </button>
        <Link href="/" className="btn btn-primary">
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
