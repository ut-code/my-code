// Generates public/docs/{lang}/{pageId}/sections.yml for each page directory.
// Each sections.yml lists the .md files in that directory in display order.

import { readdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const docsDir = join(process.cwd(), "public", "docs");

function naturalSortMdFiles(a: string, b: string): number {
  // -intro.md always comes first
  if (a === "-intro.md") return -1;
  if (b === "-intro.md") return 1;
  // Sort numerically by leading N1-N2 prefix
  const aMatch = a.match(/^(\d+)-(\d+)/);
  const bMatch = b.match(/^(\d+)-(\d+)/);
  if (aMatch && bMatch) {
    const n1Diff = parseInt(aMatch[1]) - parseInt(bMatch[1]);
    if (n1Diff !== 0) return n1Diff;
    return parseInt(aMatch[2]) - parseInt(bMatch[2]);
  }
  return a.localeCompare(b);
}

const langEntries = await readdir(docsDir);
for (const langId of langEntries) {
  const langDir = join(docsDir, langId);
  if (!(await stat(langDir)).isDirectory()) continue;

  const pageEntries = await readdir(langDir);
  for (const pageId of pageEntries) {
    // Only process page directories (start with a digit to skip index.yml and other metadata files)
    if (!/^\d/.test(pageId)) continue;
    const pageDir = join(langDir, pageId);
    if (!(await stat(pageDir)).isDirectory()) continue;

    const files = (await readdir(pageDir))
      .filter((f) => f.endsWith(".md"))
      .sort(naturalSortMdFiles);

    const yamlContent = files.map((f) => `- ${f}`).join("\n") + "\n";
    await writeFile(join(pageDir, "sections.yml"), yamlContent, "utf-8");
    console.log(
      `Generated ${langId}/${pageId}/sections.yml (${files.length} files)`
    );
  }
}
