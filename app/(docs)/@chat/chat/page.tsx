import { ChatAreaStateUpdater } from "../../chatAreaState";

// /chat にアクセスしたときチャットを閉じる

export default function EmptyPage() {
  return <ChatAreaStateUpdater chatId={null} />;
}
