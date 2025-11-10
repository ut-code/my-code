import { Metadata } from "next";
import Link from "next/link";
import { pagesList } from "./pagesList";

export const metadata: Metadata = {
  title: "my.code(); へようこそ",
  description:
    "環境構築不要、その場で実践。AIアシスタントとの対話履歴があなただけの教材へと進化する、新しいプログラミング学習サイトです。",
};

export default function Home() {
  return (
    <div className="p-4">
      <div className="hero bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-lg my-6 py-8 sm:px-4">
        <div className="hero-content text-center">
          <div className="">
            <h1 className="text-5xl font-bold mb-8">my.code(); へようこそ</h1>
            <p className="text-3xl font-bold mb-4">
              環境構築不要、その場で実践。
            </p>
            <p className="text-lg opacity-80">
              AIアシスタントとの対話履歴があなただけの教材へと進化する、新しいプログラミング学習サイトです。
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold my-8 text-center">
        チュートリアルを選ぶ
      </h2>
      <div
        className="grid items-center gap-4 my-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
        }}
      >
        {pagesList.map((group) => {
          return (
            <Link
              key={group.id}
              href={`${group.id}-${group.pages[0].id}`}
              className="card card-border bg-base-100 card-md shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="card-body">
                <h2 className="card-title">{group.lang}</h2>
                <p>{group.description}</p>
                <div className="justify-end card-actions">
                  <div className="btn btn-primary">はじめる</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <h2 className="text-2xl font-bold my-8 text-center">主な特徴</h2>
      <div
        className="grid gap-6 my-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
        }}
      >
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-primary">📚 豊富なチュートリアル</h3>
            <p>
              my.code();
              では数多くのプログラミング言語のチュートリアルを提供しています。
              初心者向けの基礎から上級者向けの応用まで、幅広いレベルに対応したチュートリアルが揃っています。
              あなたがまだ触ったことのない言語も、気軽に体験してみることができます。
            </p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-secondary">
              ⚡ すぐに動かせる実行環境
            </h3>
            <p>
              環境構築の手間なくブラウザ上ですぐにコードを実行することができます。
              チュートリアル内のサンプルコードはそのまま実行するだけでなく、自由に編集して試すことも可能です。
              さらに、エラーメッセージの解説やエラー箇所のハイライト表示など、初心者に優しい機能も充実しています。
            </p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-accent/10 to-accent/5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-accent">
              🤖 AIアシスタントによるサポート
            </h3>
            <p>
              わからないことがあれば、AIアシスタントに質問してみてください。
              AIとの対話履歴により教材そのものがアップデートされ、あなた専用の学習コンテンツとして蓄積・進化します。
              実行したコードの解説やエラーの原因調査、改善提案まで、AIアシスタントがあなたの学習を強力に支援します。
            </p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-info/10 to-info/5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-info">✏️ 実践的な練習問題</h3>
            <p>
              各チュートリアルには練習問題が含まれており、学んだ内容を実際に試すことができます。
              練習問題は段階的に難易度が上がるように設計されており、理解度を深めるのに役立ちます。
              書いたコードはその場ですぐにAIアシスタントがレビューし、フィードバックを提供します。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
