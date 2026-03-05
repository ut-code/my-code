import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import { isCloudflare } from "./detectCloudflare";
import { notFound } from "next/navigation";
import crypto from "node:crypto";

export interface MarkdownSection {
  file: string; // ファイル名
  id: string;
  level: number;
  title: string;
  rawContent: string; // 見出しも含めたもとのmarkdownの内容
  md5: string; // mdファイル全体のmd5
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

export interface RevisionYmlEntry {
  page: string;
  rev: SectionRevision[];
}
export interface SectionRevision {
  md5: string; // mdファイル全体のmd5
  git: string; // git上のコミットハッシュ
  path: string;
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
    const raw = await readPublicFile("docs/languages.json");
    return JSON.parse(raw) as string[];
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

export async function getSectionsList(
  lang: string,
  pageId: string
): Promise<string[]> {
  if (isCloudflare()) {
    const sectionsJson = await readPublicFile(
      `docs/${lang}/${pageId}/sections.json`
    );
    return JSON.parse(sectionsJson) as string[];
  } else {
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
    return (await readdir(join(process.cwd(), "public", "docs", lang, pageId)))
      .filter((f) => f.endsWith(".md"))
      .sort(naturalSortMdFiles);
  }
}

export async function getRevisions(
  sectionId: string
): Promise<RevisionYmlEntry | undefined> {
  const revisionsYml = await readPublicFile(`docs/revisions.yml`);
  return (yaml.load(revisionsYml) as Record<string, RevisionYmlEntry>)[
    sectionId
  ];
}

/**
 * public/docs/{lang}/{pageId}/ 以下のmdファイルを結合して MarkdownSection[] を返す。
 */
export async function getMarkdownSections(
  lang: string,
  pageId: string
): Promise<MarkdownSection[]> {
  const files = await getSectionsList(lang, pageId);

  const sections: MarkdownSection[] = [];
  for (const file of files) {
    const raw = await readPublicFile(`docs/${lang}/${pageId}/${file}`);
    if (file === "-intro.md") {
      // イントロセクションはフロントマターなし・見出しなし
      sections.push({
        file,
        id: `${lang}-${pageId}-intro`,
        level: 1,
        title: "",
        rawContent: raw,
        md5: crypto.createHash("md5").update(raw).digest("base64"),
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
    file,
    id: fm?.id ?? "",
    title: fm?.title ?? "",
    level: fm?.level ?? 2,
    rawContent,
    md5: crypto.createHash("md5").update(rawContent).digest("base64"),
  };
}

export async function getRevisionOfMarkdownSection(
  sectionId: string,
  md5: string
): Promise<MarkdownSection> {
  const revisions = await getRevisions(sectionId);
  const targetRevision = revisions?.rev.find((r) => r.md5 === md5);
  if (targetRevision) {
    const rawRes = await fetch(
      `https://raw.githubusercontent.com/ut-code/my-code/${targetRevision.git}/${targetRevision.path}`
    );
    if (rawRes.ok) {
      const raw = await rawRes.text();
      return parseFrontmatter(
        raw,
        `${targetRevision.git}/${targetRevision.path}`
      );
    } else {
      throw new Error(
        `Failed to fetch ${targetRevision.git}/${targetRevision.path}. ${rawRes.status}: ${await rawRes.text()}`
      );
    }
  } else {
    throw new Error(
      `Revision for sectionId=${sectionId}, md5=${md5} not found`
    );
  }
}
