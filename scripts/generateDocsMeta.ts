// Generates public/docs/{lang}/{pageId}/sections.yml for each page directory.
// Each sections.yml lists the .md files in that directory in display order.

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPagesList, getSectionsList } from "@/lib/docs";

const docsDir = join(process.cwd(), "public", "docs");

const langEntries = await getPagesList();

const langIdsJson = JSON.stringify(langEntries.map((lang) => lang.id));
await writeFile(join(docsDir, "languages.json"), langIdsJson, "utf-8");
console.log(
  `Generated languages.json (${langEntries.length} languages: ${langEntries.map((lang) => lang.id).join(", ")})`
);

for (const lang of langEntries) {
  for (const page of lang.pages) {
    const files = await getSectionsList(lang.id, page.slug);
    const filesJson = JSON.stringify(files);
    await writeFile(
      join(docsDir, lang.id, page.slug, "sections.json"),
      filesJson,
      "utf-8"
    );
    console.log(
      `Generated ${lang.id}/${page.slug}/sections.json (${files.length} files)`
    );
  }
}
