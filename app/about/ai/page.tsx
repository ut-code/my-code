import { Metadata } from "next";
import { StyledMarkdown } from "@/markdown/markdown";
import content from "./content.md?raw";

export const metadata: Metadata = {
  title: "AI質問機能について",
  description: "my.code(); のAI質問機能の詳細と利用上の注意事項について説明します。",
};

export default function AiPage() {
  return (
    <div className="p-4 pb-16 w-full max-w-docs mx-auto">
      <StyledMarkdown content={content} />
    </div>
  );
}
