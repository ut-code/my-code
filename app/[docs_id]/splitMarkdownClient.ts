import { MarkdownSection } from "./splitMarkdown";

export function splitMarkdownClient(content: string): MarkdownSection[] {
  const lines = content.split("\n");
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection | null = null;

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)/); // 見出しを検出
    if (match) {
      if (current) sections.push(current); // 前のセクションを保存
      current = {
        level: match[1].length, // 見出しレベル（# の数）
        title: match[2].trim(), // 見出しタイトル
        content: "", // 内容は後続行で追加
      };
    } else if (current) {
      current.content += line + "\n"; // セクション内容に追加
    }
  }
  if (current) sections.push(current); // 最後のセクションを保存
  return sections.map((s) => ({ ...s, content: s.content.trim() }));
}
