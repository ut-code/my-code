import { Metadata } from "next";
import licenseText from "@/../LICENSE?raw";
import { LicenseEntry, ThirdPartyLicenses } from "./ThirdPartyLicenses";
import { isCloudflare } from "@/lib/detectCloudflare";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { StyledMarkdown } from "@/markdown/markdown";

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
  let licenses: LicenseEntry[];
  if (isCloudflare()) {
    const cfAssets = getCloudflareContext().env.ASSETS;
    const res = await cfAssets!.fetch(
      `https://assets.local/_next/static/oss-licenses.json`
    );
    licenses = await res.json();
  } else {
    licenses = JSON.parse(
      await readFile(
        join(
          process.cwd(),
          process.env.NODE_ENV === "development"
            ? ".next/dev/static/oss-licenses.json"
            : ".next/static/oss-licenses.json"
        ),
        "utf-8"
      )
    );
  }

  return (
    <div className="p-4 pb-16 w-full max-w-docs mx-auto">
      <StyledMarkdown content={content} />
      <ThirdPartyLicenses licenses={licenses} />
    </div>
  );
}
