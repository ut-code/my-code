import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
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

const LANGUAGE_IDS = [
  "python",
  "ruby",
  "javascript",
  "typescript",
  "cpp",
  "rust",
] as const;

async function readIndexYml(langId: string): Promise<string> {
  if (isCloudflare()) {
    const cfAssets = getCloudflareContext().env.ASSETS;
    const res = await cfAssets!.fetch(
      `https://assets.local/docs/${langId}/index.yml`
    );
    if (!res.ok) throw new Error(`Failed to fetch index.yml for ${langId}`);
    return await res.text();
  } else {
    return await readFile(
      join(process.cwd(), "public", "docs", langId, "index.yml"),
      "utf-8"
    );
  }
}

export async function getPagesList(): Promise<LanguageEntry[]> {
  return await Promise.all(
    LANGUAGE_IDS.map(async (langId) => {
      const raw = await readIndexYml(langId);
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
