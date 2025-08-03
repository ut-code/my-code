import { notFound } from "next/navigation";
import { ChatForm } from "./chatForm";
import { StyledMarkdown } from "./markdown";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export default async function Page({
  params,
}: {
  params: Promise<{ docs_id: string }>;
}) {
  const { docs_id } = await params;

  let mdContent: string;
  try {
    const cfAssets = getCloudflareContext().env.ASSETS;
    mdContent = await cfAssets!
      .fetch(`https://assets.local/docs/${docs_id}.md`)
      .then((res) => res.text());
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="p-4">
      <StyledMarkdown content={mdContent} />
      <ChatForm />
    </div>
  );
}
