import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

export interface MarkdownSection {
  level: number;
  title: string;
  content: string;
}
/**
 * Markdownコンテンツを見出しごとに分割し、
 * 見出しのレベルとタイトル、内容を含むオブジェクトの配列を返す。
 */
export function splitMarkdown(
  content: string
): MarkdownSection[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
  // console.log(tree.children.map(({ type, position }) => ({ type, position: JSON.stringify(position) })));
  const headingNodes = tree.children.filter((node) => node.type === "heading");
  const splitContent = content.split("\n");
  const sections: MarkdownSection[] = [];
  for (let i = 0; i < headingNodes.length; i++) {
    const startLine = headingNodes.at(i)?.position?.start.line;
    if (startLine === undefined) {
      continue;
    }
    let endLine: number | undefined = undefined;
    for (let j = i + 1; j < headingNodes.length; j++) {
      if (headingNodes.at(j)?.position?.start.line !== undefined) {
        endLine = headingNodes.at(j)!.position!.start.line;
        break;
      }
    }
    sections.push({
      title: splitContent[startLine - 1].replace(/#+\s*/, "").trim(),
      content: splitContent
        .slice(startLine - 1 + 1, endLine ? endLine - 1 : undefined)
        .join("\n")
        .trim(),
      level: headingNodes.at(i)!.depth,
    });
  }
  return sections;
}
