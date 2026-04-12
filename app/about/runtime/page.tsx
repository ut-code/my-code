import { Metadata } from "next";
import { StyledMarkdown } from "@/markdown/markdown";
import content from "./content.md?raw";

export const metadata: Metadata = {
  title: "コード実行環境について",
  description: "my.code(); で使用しているコード実行環境の仕組みを説明します。",
};

export default function RuntimePage() {
  return (
    <div className="p-4 pb-16 w-full max-w-docs mx-auto">
      <StyledMarkdown content={content} />
    </div>
  );
}
