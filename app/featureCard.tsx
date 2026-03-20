"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { StyledMarkdown } from "./markdown/markdown";
import { Heading } from "./markdown/heading";
import {
  ChatAreaStateProvider,
  ChatAreaStateUpdater,
} from "./(docs)/chatAreaState";

export function FeatureCard(props: {
  reversed?: boolean;
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
  iconColor: string;
  image: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-4 md:gap-8",
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
      <div className="w-80 max-w-full md:min-w-3/7 md:max-w-1/2">
        <figure
          className={clsx(
            "aspect-video bg-base-200 rounded-xl border border-base-300 shadow-sm",
            "relative overflow-hidden select-none"
          )}
        >
          {props.image}
        </figure>
      </div>
    </div>
  );
}

export function RuntimeImage() {
  // public/docs/python/1-basics/2-2-str.md より
  return (
    <div className="absolute left-2 w-200 -inset-y-100 h-max my-auto scale-70 md:scale-85 origin-left">
      <StyledMarkdown
        content={`### 文字列（str）

文字列はシングルクォート (\`'\`) またはダブルクォート (\`"\`) で囲んで作成します。

文字列の連結は \`+\` 演算子、繰り返しは \`*\` 演算子を使います。
`}
      />
      <pre
        className={clsx(
          "bg-base-300 border-2 border-accent rounded-box shadow-md m-2 h-max",
          "p-4 font-mono"
        )}
      >
        &gt;&gt;&gt; name <HOperator>=</HOperator>{" "}
        <HString>&quot;Guido&quot;</HString>
        {"\n"}
        &gt;&gt;&gt; greeting <HOperator>=</HOperator>{" "}
        <HString>&apos;Hello&apos;</HString>
        {"\n"}
        &gt;&gt;&gt; full_greeting <HOperator>=</HOperator> greeting{" "}
        <HOperator>+</HOperator> <HString>&quot;, &quot;</HString>{" "}
        <HOperator>+</HOperator> name <HOperator>+</HOperator>{" "}
        <HString>&quot;!&quot;</HString>
        {"\n"}
        &gt;&gt;&gt; <Cursor />
      </pre>
    </div>
  );
}

export function PracticeImage() {
  // public/docs/python/1-basics/2-2-str.md より
  return (
    <div className="absolute left-2 w-200 top-0 scale-70 md:scale-85 origin-top-left">
      <StyledMarkdown
        content={`### 練習問題1

\`item_name\` という変数に商品名（文字列）、\`price\` という変数に価格（整数）、\`stock\` という変数に在庫数（整数）をそれぞれ代入してください。その後、f-stringを使って「商品: [商品名], 価格: [価格]円, 在庫: [在庫数]個」という形式の文字列にし、 \`print()\` で出力するコードを書いてみましょう。
`}
      />
      <div
        className={clsx(
          "bg-base-300 border-2 border-accent rounded-box shadow-md m-2",
          "h-60 overflow-hidden"
        )}
      >
        <div className="flex flex-row items-center bg-base-200">
          <span className="mt-2 mb-1 ml-3 mr-2 text-sm text-left">
            <span>ファイルを編集:</span>
            <span className="font-mono ml-2">practice2-1.py</span>
          </span>
          <div className="flex-1" />
        </div>
        <pre className="px-4 py-2">
          item_name = <HString>&quot;高性能マウス&quot;</HString>
          {"\n"}
          price = <HNumber>4500</HNumber>
        </pre>
      </div>
    </div>
  );
}

export function ChatImage() {
  // public/docs/python/1-basics/2-1-str.md より
  return (
    <>
      <div className="absolute right-2/5 w-[85%] md:w-[70%] top-0 scale-70 md:scale-85 origin-top-right pointer-events-none">
        {/*ここでChatAreaStateProviderのインスタンス作りダミーの値をセットすることで、
          StyledMarkdownが呼び出すMultiHighlightに現在このチャットを開いていると認識させる
        */}
        <ChatAreaStateProvider>
          <ChatAreaStateUpdater chatId="sample" />
          <StyledMarkdown
            content={`### 数値（int, float）

Pythonは整数 (\`int\`) と浮動小数点数 (\`float\`) を区別します。
浮動小数点数 (\`float\`) は、他の言語の double 型に相当する倍精度浮動小数点数です。
`}
            replacedRange={[{ start: 64, end: 120, id: "sample" }]}
          />
        </ChatAreaStateProvider>
        <pre
          className={clsx(
            "bg-base-300 border-2 border-accent rounded-box shadow-md m-2 h-max",
            "p-4 font-mono"
          )}
        >
          &gt;&gt;&gt; <HDim># 整数 (int)</HDim>
          {"\n"}
          &gt;&gt;&gt; a <HOperator>=</HOperator> <HNumber>10</HNumber>
          {"\n"}
          &gt;&gt;&gt; <HFunc>type</HFunc>
          <HDim>(</HDim>a<HDim>)</HDim>
          {"\n"}
          <HOperator>
            &lt;class <HString>&apos;int&apos;</HString>&gt;
          </HOperator>
          {"\n"}
          &gt;&gt;&gt; <HDim># 浮動小数点数 (float)</HDim>
          {"\n"}
          &gt;&gt;&gt; b <HOperator>=</HOperator> <HNumber>3.14</HNumber>
          {"\n"}
          &gt;&gt;&gt; <HFunc>type</HFunc>
          <HDim>(</HDim>b<HDim>)</HDim>
          {"\n"}
          <HOperator>
            &lt;class <HString>&apos;float&apos;</HString>&gt;
          </HOperator>
        </pre>
      </div>
      <aside
        className={clsx(
          "absolute left-3/5 md:w-80 top-0 scale-70 md:scale-85 origin-top-left",
          "bg-base-300 shadow-md p-3 flex flex-col"
        )}
      >
        <span className="flex-1 text-base font-bold opacity-40">
          AIへの質問
        </span>
        <Heading level={2} className="mt-1! mb-1! text-nowrap">
          Pythonのdouble型について
        </Heading>
        <div className="divider my-0" />
        <div className="chat chat-end place-items-start ml-3">
          <div
            className="chat-bubble p-0! bg-secondary/30"
            style={{ maxWidth: "100%", wordBreak: "break-word" }}
          >
            <StyledMarkdown content="double型はありますか？" />
          </div>
        </div>
        <StyledMarkdown
          content={`Pythonには「double型」は存在しません。他の言語（C++、Java、C#など）でおなじみのdouble型に相当するのは、Pythonの**float型**です。

Pythonのfloat型は**倍精度浮動小数点数（double-precision floating point）** を表し、他の言語のdouble型と同じ桁数の精度（通常15〜17桁）を提供します。そのため、Pythonでは単一のfloat型だけで十分です。`}
        />
      </aside>
    </>
  );
}

function HString(props: { children: ReactNode }) {
  return <span className="text-green-700">{props.children}</span>;
}
function HOperator(props: { children: ReactNode }) {
  return <span className="text-fuchsia-500">{props.children}</span>;
}
function HNumber(props: { children: ReactNode }) {
  return <span className="text-yellow-700">{props.children}</span>;
}
function HFunc(props: { children: ReactNode }) {
  return <span className="text-cyan-600">{props.children}</span>;
}
function HDim(props: { children: ReactNode }) {
  return <span className="opacity-50">{props.children}</span>;
}
function Cursor() {
  return (
    <span
      ref={(el) => {
        // カーソルの点滅アニメーション
        el?.animate([{ opacity: "1" }, { opacity: "0" }, { opacity: "1" }], {
          duration: 1000,
          iterations: Infinity,
          easing: "steps(2, end)",
        });
      }}
      style={{
        display: "inline-block",
        boxShadow: `2px 0 0 var(--color-primary) inset`,
        verticalAlign: "top",
      }}
    >
      {" "}
    </span>
  );
}
