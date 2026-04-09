import { Metadata } from "next";
import { Heading } from "@/markdown/heading";

export const metadata: Metadata = {
  title: "AI質問機能について",
  description: "my.code(); のAI質問機能の詳細と利用上の注意事項について説明します。",
};

export default function AiPage() {
  return (
    <div className="p-4 pb-16 w-full max-w-docs mx-auto">
      <Heading level={1}>AI質問機能について</Heading>
      <p className="my-4 opacity-80">
        my.code(); では、学習をサポートするためのAIアシスタント機能を提供しています。
        ご利用前に以下の事項をご確認ください。
      </p>

      <Heading level={2}>AIの回答の正確性について</Heading>
      <div className="alert alert-warning my-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <p className="font-bold">AIの回答は誤りを含む場合があります</p>
          <p className="mt-1">
            AIは非常に自信を持って誤った情報を回答することがあります。
            AIの回答を鵜呑みにせず、必ず自分自身で内容を確認するようにしてください。
          </p>
        </div>
      </div>

      <Heading level={2}>免責事項</Heading>
      <p className="my-4 opacity-80">
        AI質問機能の利用によって生じたいかなる損害についても、ut.code();
        は責任を負いません。
      </p>

      <Heading level={2}>使用しているAIモデルについて</Heading>
      <p className="my-4 opacity-80">
        AIモデルへのアクセスには{" "}
        <a
          className="link link-primary"
          href="https://openrouter.ai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenRouter
        </a>{" "}
        を使用しています。使用するモデルは ut.code();
        が選択しており、ユーザーが変更することはできません。
        また、使用するモデルは予告なく変更される場合があります。
      </p>

      <Heading level={2}>データの取り扱いについて</Heading>
      <div className="alert alert-info my-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <p className="font-bold">入力データの利用について</p>
          <ul className="list-disc list-outside ml-4 mt-1 flex flex-col gap-1">
            <li>
              AIへの質問内容やこのサイトで実行したコードのデータは、AIモデルのプロバイダーによって学習データとして利用される可能性があります。
            </li>
            <li>
              また、サービス品質の向上等を目的として、ut.code();
              のメンバーが閲覧可能な形でサイトに保存されます。
            </li>
            <li className="font-bold">
              個人情報や機密情報は入力しないようにしてください。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
