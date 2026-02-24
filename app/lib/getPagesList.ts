import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import { isCloudflare } from "./detectCloudflare";

export interface PageEntry {
  slug: string;
  name: string;
  title: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  description: string;
  pages: PageEntry[];
}

interface IndexYml {
  name: string;
  description: string;
  pages: PageEntry[];
}

async function readPublicFile(path: string): Promise<string> {
  if (isCloudflare()) {
    const cfAssets = getCloudflareContext().env.ASSETS;
    const res = await cfAssets!.fetch(`https://assets.local/${path}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return await res.text();
  } else {
    return await readFile(
      join(process.cwd(), "public", path),
      "utf-8"
    );
  }
}

async function getLanguageIds(): Promise<string[]> {
  if (isCloudflare()) {
    const raw = await readPublicFile("docs/languages.yml");
    return yaml.load(raw) as string[];
  } else {
    const docsDir = join(process.cwd(), "public", "docs");
    const entries = await readdir(docsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  }
}

export async function getPagesList(): Promise<LanguageEntry[]> {
  const langIds = await getLanguageIds();
  return await Promise.all(
    langIds.map(async (langId) => {
      const raw = await readPublicFile(`docs/${langId}/index.yml`);
      const data = yaml.load(raw) as IndexYml;
      return {
        id: langId,
        name: data.name,
        description: data.description,
        pages: data.pages,
      };
    })
  );
}
