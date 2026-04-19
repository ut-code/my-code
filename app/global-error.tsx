"use client"; // Error boundaries must be Client Components

import "@fontsource-variable/inconsolata";
// import "@fontsource/m-plus-rounded-1c/400.css";
// import "@fontsource/m-plus-rounded-1c/700.css";
import "@/m-plus-rounded-1c-nohint/400.css";
import "@/m-plus-rounded-1c-nohint/700.css";
import "./globals.css";

import { ErrorMessage } from "./errorMessage";

export default function ErrorPage({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="w-full min-h-screen flex flex-col">
        <ErrorMessage
          className="p-4 flex-1"
          h1
          back
          error={error}
          reset={reset}
        />
      </body>
    </html>
  );
}
