import { ReactNode } from "react";
import { ChatAreaStateProvider } from "./chatAreaState";
import { StreamingChatProvider } from "./streamingChatContext";

// app/(workspace)/layout.tsx
export default function WorkspaceLayout({
  children,
  docs,
  chat,
}: {
  children: ReactNode;
  docs: ReactNode;
  chat: ReactNode;
}) {
  return (
    <StreamingChatProvider>
      <ChatAreaStateProvider>
        <div className="w-full flex flex-row">
          {docs}

          {chat}

          {/* children（page.tsx）は今回は使わないか、背景として利用 */}
          {children}
        </div>
      </ChatAreaStateProvider>
    </StreamingChatProvider>
  );
}
