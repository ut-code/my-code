import { Metadata } from "next";
import licenseText from "@/../LICENSE?raw";
import { ThirdPartyLicenses } from "./ThirdPartyLicenses";
import { StyledMarkdown } from "@/markdown/markdown";
import { getLicenses, LicenseEntry } from "next-license-list";

export const metadata: Metadata = {
  title: "ライセンス",
  description:
    "my.code(); のライセンスおよび使用しているサードパーティライブラリのライセンス情報です。",
};

const content = `
# ライセンス

## my.code(); のライセンス

my.code(); のソースコードは MIT ライセンスのもとで公開されています。

\`\`\`
${licenseText}
\`\`\`

## サードパーティライブラリのライセンス

my.code(); は以下のオープンソースライブラリを使用しています。
`;

export default async function LicensePage() {
  const licenses: LicenseEntry[] = await getLicenses();

  return (
    <div className="p-4 pb-16 w-full max-w-docs mx-auto">
      <StyledMarkdown content={content} />
      <ThirdPartyLicenses licenses={licenses} />
    </div>
  );
}
