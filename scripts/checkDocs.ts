/*
mainブランチにpushされた際にGitHub Actionが --write 引数をつけて実行し、
その場合は public/docs/ 以下のドキュメントの各セクションについて、
現在のパス、md5ハッシュ、コミットIDなどを ./public/docs/revisions.yml に追記
セクションIDとページパスの対応関係をデータベースに反映

過去に存在したページが削除されている場合、エラーになります。
その場合は手動でrevisions.ymlを編集し、古いページ名の記述を新しいページ名に置き換える必要がある
(できれば自動化したいが、いい方法が思いつかない)

Dockerfile内で --check-diff 引数をつけて実行され、
revisions.ymlが最新の状態でないならexit(1)をし、dockerのビルドを停止します

なにも引数をつけずに実行した場合(npm run checkDocs)、
変更があってもなにもせず正常終了します
エラーなく全ドキュメントを取得できるかどうかの確認に使います
*/

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  getMarkdownSections,
  getPagesList,
  RevisionYmlEntry,
} from "@/lib/docs";
import yaml from "js-yaml";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { getDrizzle } from "@/lib/drizzle";
import { section as sectionTable } from "@/schema/chat";
import "dotenv/config";

let doWrite = false;
let doCheckDiff = false;
if (process.argv[2] === "--write") {
  doWrite = true;
} else if (process.argv[2] === "--check-diff") {
  doCheckDiff = true;
} else if (process.argv[2]) {
  throw new Error(`Unknown arg: ${process.argv[2]}`);
}

const docsDir = join(process.cwd(), "public", "docs");

let commit = "";
if (doWrite) {
  commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    encoding: "utf8",
  }).trim();
}

const langEntries = await getPagesList();

const revisionsPrevYml = existsSync(join(docsDir, "revisions.yml"))
  ? await readFile(join(docsDir, "revisions.yml"), "utf-8")
  : "{}";
const revisions = yaml.load(revisionsPrevYml) as Record<
  string,
  RevisionYmlEntry
>;

for (const lang of langEntries) {
  for (const page of lang.pages) {
    const sections = await getMarkdownSections(lang.id, page.slug);
    for (const section of sections) {
      if (section.id in revisions) {
        revisions[section.id].page = `${lang.id}/${page.slug}`;
        if (!revisions[section.id].rev.some((r) => r.md5 === section.md5)) {
          // ドキュメントが変更された場合
          console.warn(`${section.id} has new md5: ${section.md5}`);
          if (doWrite) {
            revisions[section.id].rev.push({
              md5: section.md5,
              git: commit,
              path: `public/docs/${lang.id}/${page.slug}/${section.file}`,
            });
          } else if (doCheckDiff) {
            process.exit(1);
          }
        }
      } else {
        // ドキュメントが新規追加された場合
        console.warn(`${section.id} is new section`);
        if (doWrite) {
          revisions[section.id] = {
            rev: [
              {
                md5: section.md5,
                git: commit,
                path: `public/docs/${lang.id}/${page.slug}/${section.file}`,
              },
            ],
            page: `${lang.id}/${page.slug}`,
          };
        } else if (doCheckDiff) {
          process.exit(1);
        }
      }
    }
  }
}

for (const id in revisions) {
  if (!existsSync(join(docsDir, revisions[id].page))) {
    console.warn(
      `The page slug ${revisions[id].page} previously used by section ${id} does not exist. ` +
        `Please replace 'page: ${revisions[id].page}' in public/docs/revisions.yml with new page path manually.`
    );
    if (doWrite || doCheckDiff) {
      process.exit(1);
    }
  }
}

if (doWrite) {
  const drizzle = await getDrizzle();
  for (const id in revisions) {
    await drizzle
      .insert(sectionTable)
      .values({
        sectionId: id,
        pagePath: revisions[id].page,
      })
      .onConflictDoUpdate({
        target: sectionTable.sectionId,
        set: { pagePath: revisions[id].page },
      });
  }

  const revisionsYml = yaml.dump(revisions, {
    sortKeys: true,
    noArrayIndent: true,
  });
  await writeFile(
    join(docsDir, "revisions.yml"),
    "# This file will be updated by CI. Do not edit manually, unless CI failed.\n" +
      revisionsYml,
    "utf-8"
  );
}
