import { Metadata } from "next";
import { Heading } from "@/markdown/heading";
import licenseText from "../../../LICENSE?raw";
import { ThirdPartyLicenses } from "./ThirdPartyLicenses";

export const metadata: Metadata = {
  title: "ライセンス",
  description: "my.code(); のライセンスおよび使用しているサードパーティライブラリのライセンス情報です。",
};

export default function LicensePage() {
  return (
    <div className="p-4 pb-16 w-full max-w-docs mx-auto">
      <Heading level={1}>ライセンス</Heading>

      <Heading level={2}>my.code(); のライセンス</Heading>
      <p className="my-4 opacity-80">
        my.code(); のソースコードは MIT ライセンスのもとで公開されています。
      </p>
      <pre className="bg-base-200 rounded-box p-4 text-sm whitespace-pre-wrap overflow-x-auto my-4">
        {licenseText}
      </pre>

      <Heading level={2}>サードパーティライブラリのライセンス</Heading>
      <p className="my-4 opacity-80">
        my.code(); は以下のオープンソースライブラリを使用しています。
      </p>
      <ThirdPartyLicenses />
    </div>
  );
}
