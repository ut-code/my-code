"use client";

import { captureException } from "@sentry/nextjs";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FallbackPre } from "./markdown/styledSyntaxHighlighter";
import { Heading } from "./markdown/heading";

interface Props {
  className?: string;
  h1?: boolean;
  back?: boolean;
  error: unknown;
  reset?: () => void;
}
export function ErrorMessage({ error, reset, ...props }: Props) {
  const [eventId, setEventId] = useState<string>();
  useEffect(() => {
    setEventId(captureException(error));
  }, [error]);

  const digest =
    typeof error === "object" &&
    error !== null &&
    "digest" in error
      ? (error as { digest: string }).digest
      : undefined;

  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center justify-center",
        props.className
      )}
    >
      {props.h1 && <Heading level={1}>エラー</Heading>}
      <p className="my-2">ページの読み込み中にエラーが発生しました。</p>
      <FallbackPre className="mx-0! max-w-max whitespace-pre-wrap">
        {error instanceof Error ? error.message : String(error)}
      </FallbackPre>
      {digest && (
        <p className="my-1 text-sm text-base-content/50">Digest: {digest}</p>
      )}
      {eventId && (
        <p className="my-1 text-sm text-base-content/50">EventID: {eventId}</p>
      )}
      {eventId && (
        <a
          className="link link-info my-2"
          href={`https://docs.google.com/forms/d/e/1FAIpQLSfkM2LKhUDgCdY2fGntuv75O3jaWISwKuBIu9MW3h3UD1I3sw/viewform?usp=pp_url&entry.758323891=${eventId}${digest ? "/" + digest : ""}`}
          target="_blank"
        >
          問い合わせフォームで報告する
        </a>
      )}
      {(props.back || reset) && (
        <>
          <div className="divider w-full self-auto!" />
          <div className="flex flex-row gap-4">
            {reset && (
              <button
                className="btn btn-warning"
                onClick={
                  // Attempt to recover by trying to re-render the segment
                  () => reset()
                }
              >
                やりなおす
              </button>
            )}
            {props.back && (
              <Link href="/" className="btn btn-primary">
                トップに戻る
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
