import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SandboxContent } from "./sandboxContent";
import { getChatFromCache, initContext } from "@/lib/chatHistory";
import { getPagesListForLang, getTermDefinitions, LangId, PageSlug } from "@/lib/docs";
import { TermDefinitionProvider } from "@/markdown/term";
import { DocsAutoRedirect } from "../[pageId]/autoRedirect";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: LangId }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const langEntry = await getPagesListForLang(lang);
  if (!langEntry) notFound();

  return {
    title: `${langEntry.name} - Sandbox`,
    description: `${langEntry.name} のインタラクティブなコード実行サンドボックスです。`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: LangId }>;
}) {
  const { lang } = await params;

  const langEntry = await getPagesListForLang(lang);
  if (!langEntry) notFound();

  const path = { lang, page: "sandbox" as PageSlug };
  const context = await initContext();
  const chatHistories = await getChatFromCache(path, context.userId);
  const termDefinitions = await getTermDefinitions(lang);

  return (
    <>
      <TermDefinitionProvider
        termDefinitions={termDefinitions}
        lang={lang}
        page={"sandbox" as PageSlug}
      >
        <SandboxContent
          langId={lang}
          path={path}
          chatHistories={chatHistories}
        />
      </TermDefinitionProvider>
      <DocsAutoRedirect path={path} />
    </>
  );
}
