import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import { isCloudflare } from "./detectCloudflare";
import { notFound } from "next/navigation";

export interface MarkdownSection {
  id: string;
  level: number;
  title: string;
  rawContent: string; // 見出しも含めたもとのmarkdownの内容
}

export interface PageEntry {
  index: number;
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
  pages: {
    slug: string;
    name: string;
    title: string;
  }[];
}

async function readPublicFile(path: string): Promise<string> {
  try {
    if (isCloudflare()) {
      const cfAssets = getCloudflareContext().env.ASSETS;
      const res = await cfAssets!.fetch(`https://assets.local/${path}`);
      if (!res.ok) {
        console.error(
          `Failed to fetch ${path}: ${res.status} ${await res.text()}`
        );
        notFound();
      }
      return await res.text();
    } else {
      return await readFile(join(process.cwd(), "public", path), "utf-8");
    }
  } catch (e) {
    console.error(`Failed to read file ${path}: ${e}`);
    notFound();
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
        pages: data.pages.map((p, index) => ({
          ...p,
          index,
        })),
      };
    })
  );
}

/**
 * public/docs/{lang}/{pageId}/ 以下のmdファイルを結合して MarkdownSection[] を返す。
 */
export async function getMarkdownSections(
  lang: string,
  pageId: string
): Promise<MarkdownSection[]> {
  const sectionsYml = await readPublicFile(
    `docs/${lang}/${pageId}/sections.yml`
  );
  const files = yaml.load(sectionsYml) as string[];

  const sections: MarkdownSection[] = [];
  for (const file of files) {
    const raw = await readPublicFile(`docs/${lang}/${pageId}/${file}`);
    if (file === "-intro.md") {
      // イントロセクションはフロントマターなし・見出しなし
      sections.push({
        id: `${lang}-${pageId}-intro`,
        level: 1,
        title: "",
        rawContent: raw,
      });
    } else {
      sections.push(parseFrontmatter(raw, file));
    }
  }
  return sections;
}

/**
 * YAMLフロントマターをパースしてid, title, level, bodyを返す。
 * フロントマターがない場合はid/titleを空文字、levelを0で返す。
 */
function parseFrontmatter(content: string, file: string): MarkdownSection {
  if (!content.startsWith("---\n")) {
    throw new Error(`File ${file} is missing frontmatter`);
  }
  const endIdx = content.indexOf("\n---\n", 4);
  if (endIdx === -1) {
    throw new Error(`File ${file} has invalid frontmatter`);
  }
  const fm = yaml.load(content.slice(4, endIdx)) as {
    id?: string;
    title?: string;
    level?: number;
  };
  // TODO: validation of frontmatter using zod
  // replコードブロックにはセクションidをターミナルidとして与える。
  const rawContent = content
    .slice(endIdx + 5)
    .replace(/-repl\s*\n/, `-repl:${fm?.id ?? ""}\n`);
  return {
    id: fm?.id ?? "",
    title: fm?.title ?? "",
    level: fm?.level ?? 2,
    rawContent,
  };
}
