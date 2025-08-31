import Link from "next/link";
import { pagesList } from "./pagesList";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold my-4">my.code(); へようこそ</h1>
      <p>
        my.code();
        はプログラミング言語のチュートリアルを提供するウェブサイトです。
      </p>
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
              className="card card-border bg-base-100 card-md shadow-md"
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
      <h2 className="text-2xl font-bold my-4">主な特徴</h2>
      {/* TODO: デザインがダサい */}
      <ul className="list-disc list-inside space-y-4">
        <li>
          豊富なチュートリアル
          <p className="ml-8">
            my.code();
            ではさまざまなプログラミング言語やフレームワークのチュートリアルを提供しています。
            初心者向けの基礎から上級者向けの応用まで、幅広いレベルに対応したチュートリアルが揃っています。
            {/* ほんまか？ */}
          </p>
        </li>
        <li>
          すぐに動かせる実行環境
          <p className="ml-8">
            my.code();
            ではブラウザ上でコードを実行できる環境を整備しており、環境構築の手間なくすぐにコードを実行することができます。
            チュートリアル内のサンプルコードはそのまま実行するだけでなく、自由に編集して試すことも可能です。
          </p>
        </li>
        <li>
          AIアシスタントによるサポート
          <p className="ml-8">
            my.code(); ではAIアシスタントが学習をサポートします。
            チュートリアルを読んでいてわからないことがあれば、AIアシスタントに質問してみてください。
            さらに、実行したサンプルコードの解説やエラーの原因調査、改善提案まで、AIアシスタントがあなたの学習を強力に支援します。
          </p>
        </li>
        <li>
          実践的な練習問題
          <p className="ml-8">
            各チュートリアルには練習問題が含まれており、学んだ内容を実際に試すことができます。
            練習問題は段階的に難易度が上がるように設計されており、理解度を深めるのに役立ちます。
            書いたコードはその場ですぐにAIアシスタントがレビューし、フィードバックを提供します。
          </p>
        </li>
      </ul>
    </div>
  );
}
