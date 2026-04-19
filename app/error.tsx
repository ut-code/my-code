"use client"; // Error boundaries must be Client Components

import { ErrorMessage } from "./errorMessage";

export default function ErrorPage({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return (
    <ErrorMessage className="p-4 flex-1" h1 back error={error} reset={reset} />
  );
}
