import { Metadata } from "next";
import Link from "next/link";
import { getPagesList } from "@/lib/docs";
import clsx from "clsx";
import { ReactNode } from "react";
import { LanguageIcon } from "./terminal/icons";
import { RuntimeLang } from "@my-code/runtime/languages";

export const metadata: Metadata = {
  title: "my.code(); へようこそ",
  description:
    "環境構築不要、その場で実践。AIアシスタントとの対話履歴があなただけの教材へと進化する、新しいプログラミング学習サイトです。",
};

export default async function Home() {
  const pagesList = await getPagesList();
  return (
    <div className="w-full p-4">
      <div className="max-w-docs mx-auto">
        <div
          className={clsx(
            "hero bg-gradient-to-br from-primary/30 via-secondary/10 to-accent/30 rounded-3xl",
            "my-8 py-4 px-0 mb-8",
            "sm:px-4",
            "md:py-8 md:mb-12",
            "lg:py-16 lg:mb-16",
            "xl:py-16 xl:mb-20"
          )}
        >
          <div className="hero-content text-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="font-mono text-primary mr-3 drop-shadow-sm">
                  my.code();
                </span>
                へようこそ
              </h1>
              <p className="text-2xl md:text-3xl font-bold mb-6 opacity-90">
                環境構築不要、その場で実践。
              </p>
              <p className="text-lg md:text-xl opacity-80 mb-10 leading-relaxed">
                AIアシスタントとの対話履歴があなただけの教材へと進化する、
                <br className="hidden md:block" />
                新しいプログラミング学習サイトです。
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="#tutorials"
                  className="btn btn-primary btn-xl btn-wide rounded-box"
                >
                  はじめる
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/*<h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">主な特徴</h2>*/}
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 xl:gap-16">
          {/*<FeatureCard
          icon="📚"
          iconColor="bg-primary/10 text-primary"
          title="豊富なチュートリアル"
        >
          my.code();
          では数多くのプログラミング言語のチュートリアルを提供しています。
          初心者向けの基礎から上級者向けの応用まで、幅広いレベルに対応したチュートリアルが揃っています。
          あなたがまだ触ったことのない言語も、気軽に体験してみることができます。
        </FeatureCard>*/}
          <FeatureCard
            icon="⚡"
            iconColor="bg-primary/10 text-primary"
            title="環境構築は一切不要。ブラウザで動く実行環境"
          >
            面倒な開発環境のセットアップで挫折する必要はありません。
            チュートリアル内のサンプルコードは、ボタン一つでそのまま実行可能。
            もちろん自由に編集して結果を試すこともできます。
            {/*さらに、エラーメッセージの解説やエラー箇所のハイライト表示など、初心者に優しい機能も充実しています。*/}
          </FeatureCard>
          <FeatureCard
            icon="🤖"
            iconColor="bg-secondary/10 text-secondary"
            title="AIアシスタントがあなたの学習をサポート"
            reversed
          >
            エラーの原因がわからない？コードの意味を知りたい？
            AIアシスタントにいつでも質問できます。
            あなたとの対話履歴がそのまま蓄積され、あなただけの最強の復習ノートへと進化します。
          </FeatureCard>
          <FeatureCard
            icon="✏️"
            iconColor="bg-accent/10 text-accent"
            title="実践的な練習問題"
          >
            {/*todo: 他セクションと同じスタイルの文章で書き直す？*/}
            各チュートリアルには練習問題が含まれており、学んだ内容を実際に試すことができます。
            練習問題は段階的に難易度が上がるように設計されており、理解度を深めるのに役立ちます。
            書いたコードはその場ですぐにAIアシスタントがレビューし、フィードバックを提供します。
          </FeatureCard>
        </div>

        <div className="divider md:my-8 lg:my-12 xl:my-16" />

        <h2 id="tutorials" className="text-3xl font-bold mb-4 text-center">
          さあ、学習を始めましょう
        </h2>
        <p className="text-center opacity-70 mb-10">
          豊富なラインナップから、学びたい言語を選択してください。
        </p>
        <div
          className="grid items-center gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
          }}
        >
          {pagesList.map((group) => {
            return (
              <Link
                key={group.id}
                href={`${group.id}/${group.pages[0].slug}`}
                className={clsx(
                  "card card-border border-2 card-sm bg-base-200 border-base-300 shadow-sm",
                  "hover:shadow-md transition-all hover:-translate-y-0.5",
                  "hover:border-primary hover:text-primary "
                )}
              >
                <div className="card-body">
                  <div className="card-title justify-between">
                    <span className="flex gap-2 items-center">
                      <LanguageIcon
                        className="w-5 h-5"
                        lang={group.id as RuntimeLang}
                      />
                      {group.name}
                    </span>
                    <span className="text-2xl/0">&raquo;</span>
                  </div>
                  <p>{group.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeatureCard(props: {
  reversed?: boolean;
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
  iconColor: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-4 md:gap-8 lg:gap-16",
        props.reversed ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      <div className="flex-1 space-y-4 lg:space-y-8">
        <div className="flex flex-row gap-2 items-center">
          <span className={clsx("p-3 rounded-xl text-2xl", props.iconColor)}>
            {props.icon}
          </span>
          <h3 className="text-2xl/8 md:text-3xl/10 font-bold">{props.title}</h3>
        </div>
        <p className="opacity-70 leading-relaxed text-lg">{props.children}</p>
      </div>
      <div className="w-80 max-w-full md:min-w-2/5 md:max-w-1/2">
        {/* スクリーンショットのプレースホルダー（後で実際の画像に差し替えてください） */}
        <div className="aspect-video bg-base-200 rounded-xl border border-base-300 shadow-lg flex items-center justify-center overflow-hidden">
          <span className="text-base-content/40 font-mono">Screenshot</span>
        </div>
      </div>
    </div>
  );
}
