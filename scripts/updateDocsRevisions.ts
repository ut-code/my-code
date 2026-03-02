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

for (const id in revisions) {
  delete revisions[id].lang;
  delete revisions[id].page;
}

for (const lang of langEntries) {
  for (const page of lang.pages) {
    const sections = await getMarkdownSections(lang.id, page.slug);
    for (const section of sections) {
      if (section.file === "-intro.md") continue;
      if (section.id in revisions) {
        revisions[section.id].lang = lang.id;
        revisions[section.id].page = page.slug;
        if (!revisions[section.id].rev.some((r) => r.md5 === section.md5)) {
          // ドキュメントが変更された場合
          console.log(`${section.id} has new md5: ${section.md5}`);
          revisions[section.id].rev.push({
            md5: section.md5,
            commit,
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
              commit,
              path: `public/docs/${lang.id}/${page.slug}/${section.file}`,
            },
          ],
          lang: lang.id,
          page: page.slug,
        };
      }
    }
  }
}

const revisionsYml = yaml.dump(revisions);
await writeFile(
  join(docsDir, "revisions.yml"),
  "# This file will be updated by scripts/updateDocsRevisions.ts. Do not edit manually.\n" +
    revisionsYml,
  "utf-8"
);
