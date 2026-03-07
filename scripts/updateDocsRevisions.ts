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
import { eq } from "drizzle-orm";
import "dotenv/config";

const docsDir = join(process.cwd(), "public", "docs");

const commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
  encoding: "utf8",
}).trim();

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
          console.log(`${section.id} has new md5: ${section.md5}`);
          revisions[section.id].rev.push({
            md5: section.md5,
            git: commit,
            path: `public/docs/${lang.id}/${page.slug}/${section.file}`,
          });
        }
      } else {
        // ドキュメントが新規追加された場合
        console.log(`${section.id} is new, adding to revisions.yml`);
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
      }
    }
  }
}

for (const id in revisions) {
  if (!existsSync(join(docsDir, revisions[id].page))) {
    throw new Error(
      `The page slug ${revisions[id].page} previously used by section ${id} does not exist. ` +
        `Please replace 'page: ${revisions[id].page}' in public/docs/revisions.yml with new page path manually.`
    );
  }
}

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
