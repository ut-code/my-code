import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MarkdownSection, splitMarkdown } from "./splitMarkdown";
import { Section } from "./section";
import pyodideLock from "pyodide/pyodide-lock.json";
import { PageContent } from "./pageContent";

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;

  let mdContent: string;
  try {
    if (process.env.NODE_ENV === "development") {
      mdContent = await readFile(
        join(process.cwd(), "public", "docs", `${docs_id}.md`),
        "utf-8"
      );
    } else {
      const cfAssets = getCloudflareContext().env.ASSETS;
      const mdRes = await cfAssets!.fetch(
        `https://assets.local/docs/${docs_id}.md`
      );
      if (mdRes.ok) {
        mdContent = await mdRes.text();
      } else {
        notFound();
      }
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  mdContent = mdContent.replaceAll(
    "{process.env.PYODIDE_PYTHON_VERSION}",
    String(pyodideLock.info.python)
  );

  const splitMdContent: MarkdownSection[] = await splitMarkdown(mdContent);

  return <PageContent splitMdContent={splitMdContent} docs_id={docs_id} />;
}
