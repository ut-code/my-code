// Generates public/docs/{lang}/{pageId}/sections.yml for each page directory.
// Each sections.yml lists the .md files in that directory in display order.

import { unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  getMarkdownSections,
  getPagesList,
  getTermDefinitions,
} from "@/lib/docs";
import { existsSync } from "node:fs";

const docsDir = join(process.cwd(), "public", "docs");

const langEntries = await getPagesList();

const langIdsJson = JSON.stringify(langEntries.map((lang) => lang.id));
await writeFile(join(docsDir, "languages.json"), langIdsJson, "utf-8");
console.log(
  `Generated languages.json (${langEntries.length} languages: ${langEntries.map((lang) => lang.id).join(", ")})`
);

for (const lang of langEntries) {
  if (existsSync(join(docsDir, lang.id, "termDefinitions.json"))) {
    await unlink(join(docsDir, lang.id, "termDefinitions.json"));
  }
  const terms = await getTermDefinitions(lang.id);
  await writeFile(
    join(docsDir, lang.id, "termDefinitions.json"),
    JSON.stringify(terms),
    "utf-8"
  );
  console.log(
    `Generated ${lang.id}/termDefinitions.json (${terms.length} definitions, ${terms.reduce((sum, td) => sum + td.alias.length, 0)} terms)`
  );

  for (const page of lang.pages) {
    const sections = await getMarkdownSections(lang.id, page.slug);
    await writeFile(
      join(docsDir, lang.id, page.slug, "sections.json"),
      JSON.stringify(sections),
      "utf-8"
    );
    console.log(
      `Generated ${lang.id}/${page.slug}/sections.json (${sections.length} files)`
    );
  }
}
