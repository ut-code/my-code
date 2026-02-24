// Generates public/docs/languages.yml listing all language directories.

import { readdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";

const docsDir = join(process.cwd(), "public", "docs");

const entries = await readdir(docsDir);
const langIds: string[] = [];
for (const entry of entries) {
  const entryPath = join(docsDir, entry);
  if ((await stat(entryPath)).isDirectory()) {
    langIds.push(entry);
  }
}
langIds.sort();

const yamlContent = yaml.dump(langIds);
await writeFile(join(docsDir, "languages.yml"), yamlContent, "utf-8");
console.log(`Generated languages.yml (${langIds.length} languages: ${langIds.join(", ")})`);
