import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-4 flex-1 w-max max-w-full mx-auto flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">404</h1>
      <p>指定されたページが見つかりません。</p>
      <div className="divider w-full self-auto!" />
      <Link href="/" className="btn btn-primary">
        トップに戻る
      </Link>
    </div>
  );
}
