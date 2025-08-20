import Prism from "prismjs";
import chalk from "chalk";
// Python言語定義をインポート
import "prismjs/components/prism-python";

const nothing = (text: string): string => text;

// PrismのトークンクラスとANSIコードをマッピング
const prismToAnsi: Record<string, (text: string) => string> = {
  //
  comment: chalk.dim,
  prolog: chalk.dim,
  cdata: chalk.dim,
  doctype: chalk.dim,
  punctuation: chalk.dim,
  entity: chalk.dim,
  //
  keyword: chalk.magenta,
  operator: chalk.magenta,
  //
  builtin: chalk.cyan,
  url: chalk.cyan,
  //
  "attr-name": chalk.blue,
  "class-name": chalk.blue,
  variable: chalk.blue,
  function: chalk.blue,
  //
  boolean: chalk.yellow,
  constant: chalk.yellow,
  number: chalk.yellow,
  atrule: chalk.yellow,
  //
  property: chalk.red,
  tag: chalk.red,
  symbol: chalk.red,
  deleted: chalk.red,
  important: chalk.red,
  //
  selector: chalk.green,
  string: chalk.green,
  char: chalk.green,
  inserted: chalk.green,
  regex: chalk.green,
  "attr-value": chalk.green,
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
      const tokenTypes = (node as Element).className
        .replace("token ", "")
        .split(" ");
      let highlight: ((text: string) => string) | undefined = undefined;
      for (const tokenType of tokenTypes) {
        // トークンタイプに対応するANSIコードを取得
        if (tokenType in prismToAnsi) {
          highlight = prismToAnsi[tokenType];
          break; // 最初に見つかったものを使用
        }
      }
      if (!highlight) {
        console.warn(`Unknown token type: ${tokenTypes}`);
      }

      // 子ノードを再帰的に処理
      return (highlight || nothing)(
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
