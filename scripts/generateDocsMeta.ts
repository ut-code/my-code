// Generates public/docs/{lang}/{pageId}/sections.yml for each page directory.
// Each sections.yml lists the .md files in that directory in display order.

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import { getPagesList, getSectionsList } from "@/lib/docs";

const docsDir = join(process.cwd(), "public", "docs");

const langEntries = await getPagesList();

const yamlContent = yaml.dump(langEntries.map((lang) => lang.id));
await writeFile(join(docsDir, "languages.yml"), yamlContent, "utf-8");
console.log(`Generated languages.yml (${langEntries.length} languages: ${langEntries.map((lang) => lang.id).join(", ")})`);

for (const lang of langEntries) {
  for (const page of lang.pages) {
    const files = await getSectionsList(lang.id, page.slug);
    const yamlContent = yaml.dump(files);
    await writeFile(
      join(docsDir, lang.id, page.slug, "sections.yml"),
      yamlContent,
      "utf-8"
    );
    console.log(
      `Generated ${lang.id}/${page.slug}/sections.yml (${files.length} files)`
    );
  }
}

