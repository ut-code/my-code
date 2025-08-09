import Prism from "prismjs";
import chalk from "chalk";
// Python言語定義をインポート
import "prismjs/components/prism-python";

const nothing = (text: string): string => text;

// PrismのトークンクラスとANSIコードをマッピング
const prismToAnsi: Record<string, (text: string) => string> = {
  keyword: chalk.bold.cyan,
  function: chalk.bold.yellow,
  string: chalk.green,
  number: chalk.yellow,
  boolean: chalk.yellow,
  comment: chalk.dim,
  operator: chalk.magenta,
  punctuation: nothing,
  "class-name": chalk.bold.blue,
  // 必要に応じて他のトークンも追加
};

/**
 * Prism.jsでハイライトされたHTMLを解析し、ANSIエスケープシーケンスを含む文字列に変換する
 * @param {string} code ハイライト対象のPythonコード
 * @returns {string} ANSIで色付けされた文字列
 */
export function highlightCodeToAnsi(code: string, language: string): string {
  // Prismでハイライト処理を行い、HTML文字列を取得
  const highlightedHtml = Prism.highlight(
    code,
    Prism.languages[language],
    language
  );

  // 一時的なDOM要素を作成してパース
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = highlightedHtml;

  // DOMノードを再帰的にトラバースしてANSI文字列を構築
  function traverseNodes(node: Node): string {
    // テキストノードの場合、そのままテキストを追加
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    // 要素ノード(<span>)の場合
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tokenType = (node as Element).className.replace("token ", "");
      if (!(tokenType in prismToAnsi)) {
        console.warn(`Unknown token type: ${tokenType}`);
      }
      const withHighlight: (text: string) => string =
        prismToAnsi[tokenType] ?? nothing;

      // 子ノードを再帰的に処理
      return withHighlight(
        Array.from(node.childNodes).reduce(
          (acc, child) => acc + traverseNodes(child),
          ""
        )
      );
    }

    return "";
  }

  return Array.from(tempDiv.childNodes).reduce(
    (acc, child) => acc + traverseNodes(child),
    ""
  );
}
