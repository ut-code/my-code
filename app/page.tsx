import Link from "next/link";
import { pagesList } from "./pagesList";

export default function Home() {
  return (
    <div className="p-4">
      <div className="hero bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-lg my-6 py-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">my.code(); へようこそ</h1>
            <p className="text-lg mb-4">
              my.code();
              はプログラミング言語のチュートリアルを提供するウェブサイトです。
            </p>
            <p className="text-base opacity-80">
              ブラウザ上で動かせる実行環境とAIアシスタントで、あなたの学習を強力にサポートします。
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
            <div
              key={group.id}
              className="card card-border bg-base-100 card-md shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="card-body">
                <h2 className="card-title">{group.lang}</h2>
                <p>{group.description}</p>
                <div className="justify-end card-actions">
                  <Link
                    href={`${group.id}-${group.pages[0].id}`}
                    className="btn btn-primary"
                  >
                    はじめる
                  </Link>
                </div>
              </div>
            </div>
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
              ではさまざまなプログラミング言語やフレームワークのチュートリアルを提供しています。
              初心者向けの基礎から上級者向けの応用まで、幅広いレベルに対応したチュートリアルが揃っています。
            </p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-secondary">
              ⚡ すぐに動かせる実行環境
            </h3>
            <p>
              my.code();
              ではブラウザ上でコードを実行できる環境を整備しており、環境構築の手間なくすぐにコードを実行することができます。
              チュートリアル内のサンプルコードはそのまま実行するだけでなく、自由に編集して試すことも可能です。
            </p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-accent/10 to-accent/5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title text-accent">
              🤖 AIアシスタントによるサポート
            </h3>
            <p>
              my.code(); ではAIアシスタントが学習をサポートします。
              チュートリアルを読んでいてわからないことがあれば、AIアシスタントに質問してみてください。
              さらに、実行したサンプルコードの解説やエラーの原因調査、改善提案まで、AIアシスタントがあなたの学習を強力に支援します。
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
