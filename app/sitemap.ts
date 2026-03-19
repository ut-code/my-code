import type { MetadataRoute } from "next";
import {
  getCommitDate,
  getMarkdownSections,
  getPagesList,
  getRevisions,
} from "./lib/docs";

export const dynamic = "force-static";

const origin = "https://my-code.utcode.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pagesList = await getPagesList();

  return [
    {
      url: origin,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...(await Promise.all(
      pagesList
        .map((lang) =>
          lang.pages.map(async (page) => {
            const sections = await getMarkdownSections(lang.id, page.slug);
            const sectionsDate = await Promise.all(
              sections.map((s) =>
                getRevisions(s.id)
                  .then((revisions) => revisions?.rev.at(-1))
                  .then((lastRev) =>
                    lastRev ? getCommitDate(lastRev.git) : null
                  )
              )
            );
            return {
              url: `${origin}/${lang.id}/${page.slug}`,
              priority: 0.8,
              changeFrequency: "monthly",
              lastModified: sectionsDate.reduce(
                (latest: Date, date: Date | null) => {
                  if (!date) return latest;
                  return date > latest ? date : latest;
                },
                new Date(0)
              ),
            } satisfies MetadataRoute.Sitemap[number];
          })
        )
        .flat()
    )),
  ];
}
