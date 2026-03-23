import { Metadata } from "next";
import Link from "next/link";
import { getPagesList } from "@/lib/docs";
import clsx from "clsx";
import { LanguageIcon } from "./terminal/icons";
import { RuntimeLang } from "@my-code/runtime/languages";
import {
  ChatImage,
  FeatureCard,
  PracticeImage,
  RuntimeImage,
} from "./featureCard";
import { DaisyInfoIcon } from "./daisyAlertIcon";

export const metadata: Metadata = {
  title: "my.code(); へようこそ",
  description:
    "環境構築不要、その場で実践。AIアシスタントとの対話履歴があなただけの教材へと進化する、新しいプログラミング学習サイトです。",
};

export default async function Home() {
  const pagesList = await getPagesList();
  return (
    <div className="w-full p-4 pb-16 md:pb-20 lg:pb-24">
      {/*og画像を生成する時に使ったもの
      <figure className="border w-[1200px] h-[630px]">
        <div className="flex gap-1 items-center justify-center w-[240px] h-[126px] scale-500 origin-top-left">
          <img src="/icon.svg" alt="my.code(); Logo" className="size-[48px]" />
          <span className="text-[32px] font-bold font-mono drop-shadow-sm text-primary">
            my.code();
          </span>
        </div>
      </figure>*/}
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
            image={<RuntimeImage />}
          >
            面倒な開発環境のセットアップで挫折する必要はありません。
            チュートリアル内のサンプルコードは、 my.code();
            のウェブサイト上でそのまま実行可能。
            もちろん自由に編集して結果を試すこともできます。
            {/*さらに、エラーメッセージの解説やエラー箇所のハイライト表示など、初心者に優しい機能も充実しています。*/}
          </FeatureCard>
          <FeatureCard
            icon="🤖"
            iconColor="bg-secondary/10 text-secondary"
            title="AIアシスタントがあなたの学習をサポート"
            reversed
            image={<ChatImage />}
          >
            エラーの原因がわからない？コードの意味を知りたい？
            AIアシスタントにいつでも質問できます。
            あなたとの対話履歴がそのまま蓄積され、あなただけの最強の復習ノートへと進化します。
          </FeatureCard>
          <FeatureCard
            icon="✏️"
            iconColor="bg-accent/10 text-accent"
            title="練習問題で理解を深める"
            image={<PracticeImage />}
          >
            各チュートリアルには、学んだ内容を実践できる練習問題が用意されています。
            実際に自分でコードを書いて実行することで、理解をさらに深めることができます。
            {/*書いたコードはAIアシスタントがレビューし、フィードバックを提供します。*/}
          </FeatureCard>
        </div>

        <div className="divider md:my-8 lg:my-12 xl:my-16" />

        <h2 id="tutorials" className="text-3xl font-bold mb-4 text-center">
          さあ、学習を始めましょう
        </h2>
        <p className="text-center opacity-70 mb-4">
          豊富なラインナップから、学びたい言語を選択してください。
          <br />
          my.code();
          ならあなたがまだ触ったことがない言語を気軽に体験することができます。
        </p>
        <div className="alert alert-info alert-dash mb-4 w-max max-w-full mx-auto">
          <DaisyInfoIcon />
          <span>
            プログラミング未経験の方、何から始めればいいかわからない...という方は、
            <br className="hidden md:block" />
            まずは
            <a
              className="link mx-1"
              style={{
                color: "#25c2a0",
                fontFamily:
                  'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              }}
              href="https://learn.utcode.net"
              target="_blank"
            >
              ut.code(); Learn
            </a>
            でプログラミングの基礎を学ぶことをおすすめします！
          </span>
        </div>
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
