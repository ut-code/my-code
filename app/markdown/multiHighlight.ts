import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, PhrasingContent } from "mdast";

export interface ReplacedRange {
  start: number;
  end: number;
  id: string;
}
export const remarkMultiHighlight: Plugin<[ReplacedRange[]], Root> = (
  replacedRange?: ReplacedRange[]
) => {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      const nodeStart = node.position?.start?.offset;
      if (
        nodeStart === undefined ||
        index === undefined ||
        parent === undefined
      )
        return;

      const textLen = node.value.length;
      const nodeEnd = nodeStart + textLen;

      // 1. このテキストノードに被るハイライトが1つもなければスキップ (最適化)
      if (!replacedRange) return;
      const hasOverlap = replacedRange.some(
        (hl) => hl.start < nodeEnd && hl.end > nodeStart
      );
      if (!hasOverlap) return;

      // 2. テキストを分割するための「境界インデックス(相対位置)」を収集
      let boundaries = [0, textLen]; // ノードの最初と最後は必ず入れる

      replacedRange.forEach((hl) => {
        const relStart = hl.start - nodeStart;
        const relEnd = hl.end - nodeStart;

        // ノードの途中にある境界だけを追加
        if (relStart > 0 && relStart < textLen) boundaries.push(relStart);
        if (relEnd > 0 && relEnd < textLen) boundaries.push(relEnd);
      });

      // 3. 境界インデックスの重複を排除し、昇順にソートする
      boundaries = Array.from(new Set(boundaries)).sort((a, b) => a - b);

      const newNodes: PhrasingContent[] = [];

      // 4. 隣り合う境界ごとに区間(セグメント)を切り出す
      for (let i = 0; i < boundaries.length - 1; i++) {
        const startIdx = boundaries[i];
        const endIdx = boundaries[i + 1];

        const textValue = node.value.slice(startIdx, endIdx);
        const absStart = nodeStart + startIdx;
        const absEnd = nodeStart + endIdx;

        // 5. この区間を完全に包含しているハイライトIDをすべて抽出
        const activeIds = replacedRange
          .filter((hl) => hl.start <= absStart && hl.end >= absEnd)
          .map((hl) => hl.id);

        if (activeIds.length > 0) {
          // 該当するハイライトがある場合、クラス名を複数付与してカスタムノード化
          const classNames = activeIds;

          // カスタムタイプ('highlight')は標準のmdastに存在しないため、型アサーションでエラーを回避します
          newNodes.push({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: "highlight" as any,
            data: {
              hName: "ins",
              // AST(hast)の仕様上、classNameは配列で渡すとスペース区切りで展開されます
              hProperties: { className: classNames },
            },
            children: [{ type: "text", value: textValue }],
          });
        } else {
          // どのハイライトにも含まれない場合は通常のテキスト
          newNodes.push({ type: "text", value: textValue });
        }
      }

      // 6. 元のテキストノードを分割したノード群に置き換える
      parent.children.splice(index, 1, ...newNodes);

      // 追加したノード分インデックスを進める
      return index + newNodes.length;
    });
  };
};
