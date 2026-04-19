"use client"; // Error boundaries must be Client Components

import { ChatAreaContainer } from "./chat/[chatId]/chatArea";
import { ErrorMessage } from "@/errorMessage";

export default function Error({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ChatAreaContainer chatId={"error"}>
      <ErrorMessage error={error} />
    </ChatAreaContainer>
  );
}
