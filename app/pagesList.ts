// docs_id = `${group.id}-${page.id}`
export const pagesList = [
  {
    id: "python",
    lang: "Python",
    // TODO: これをいい感じの文章に変える↓
    description: "Pythonの基礎から応用までを学べるチュートリアル",
    pages: [
      { id: 1, title: "環境構築と基本思想" },
      { id: 2, title: "基本構文とデータ型" },
      { id: 3, title: "リスト、タプル、辞書、セット" },
      { id: 4, title: "制御構文と関数" },
      { id: 5, title: "モジュールとパッケージ" },
      { id: 6, title: "オブジェクト指向プログラミング" },
      {
        id: 7,
        title: "ファイルの入出力とコンテキストマネージャ",
      },
      { id: 8, title: "例外処理" },
      { id: 9, title: "ジェネレータとデコレータ" },
    ],
  },
  {
    id: "ruby",
    lang: "Ruby",
    description: "hoge",
    pages: [
      { id: 1, title: "rubyの世界へようこそ" },
      { id: 2, title: "基本構文とデータ型" },
      { id: 3, title: "制御構造とメソッド定義" },
      { id: 4, title: "すべてがオブジェクト" },
      { id: 5, title: "コレクション (Array, Hash, Range)" },
      { id: 6, title: "ブロックとイテレータ" },
      { id: 7, title: "クラスとオブジェクト" },
      { id: 8, title: "モジュールとMix-in" },
      { id: 9, title: "Proc, Lambda, クロージャ" },
      { id: 10, title: "標準ライブラリの活用" },
      { id: 11, title: "テスト文化入門" },
      { id: 12, title: "メタプログラミング入門" },
    ],
  },
  {
    id: "javascript",
    lang: "JavaScript",
    description: "hoge",
    pages: [
      { id: 1, title: "JavaScriptへようこそ" },
      { id: 2, title: "基本構文とデータ型" },
      { id: 3, title: "制御構文" },
      { id: 4, title: "関数とクロージャ" },
      { id: 5, title: "'this'の正体" },
      { id: 6, title: "オブジェクトとプロトタイプ" },
      { id: 7, title: "クラス構文" },
      { id: 8, title: "配列とイテレーション" },
      { id: 9, title: "非同期処理①: Promise" },
      { id: 10, title: "非同期処理②: Async/Await" },
    ],
  },
  {
    id: "typescript",
    lang: "TypeScript",
    description: "にゃー",
    pages: [
      { id: 1, title: "TypeScriptへようこそ" },
      { id: 2, title: "基本的な型と型推論" },
      { id: 3, title: "オブジェクト、インターフェース、型エイリアス" },
      { id: 4, title: "関数の型定義" },
      { id: 5, title: "型を組み合わせる" },
      { id: 6, title: "ジェネリクス" },
      { id: 7, title: "クラスとアクセス修飾子" },
      { id: 8, title: "非同期処理とユーティリティ型" },
    ],
  },
  {
    id: "cpp",
    lang: "C++",
    description: "C++の基本から高度な機能までを学べるチュートリアル",
    pages: [
      { id: 1, title: "C++の世界へようこそ" },
      { id: 2, title: "型システムと制御構造" },
      { id: 3, title: "データ集合とモダンな操作" },
      { id: 4, title: "ポインタとメモリ管理" },
      { id: 5, title: "関数と参照渡し" },
      { id: 6, title: "プロジェクトの分割とビルド" },
      { id: 7, title: "クラスの基礎" },
      { id: 8, title: "クラスを使いこなす" },
      { id: 9, title: "継承とポリモーフィズム" },
      { id: 10, title: "テンプレート" },
      { id: 11, title: "STL ①:コンテナ" },
      { id: 12, title: "STL ②:アルゴリズムとラムダ式" },
      { id: 13, title: "RAIIとスマートポインタ" },
    ],
  },
  {
    id: "rust",
    lang: "Rust",
    description: "a",
    pages: [
      { id: 1, title: "Rustの世界へようこそ" },
      { id: 2, title: "基本構文と「不変性」" },
      { id: 3, title: "関数と制御フロー" },
      { id: 4, title: "所有権" },
      { id: 5, title: "借用とスライス" },
      { id: 6, title: "構造体とメソッド構文" },
      { id: 7, title: "列挙型とパターンマッチ" },
      { id: 8, title: "モジュールシステムとパッケージ管理" },
      { id: 9, title: "コレクションと文字列" },
      { id: 10, title: "エラーハンドリング" },
      { id: 11, title: "ジェネリクスとトレイト" },
      { id: 12, title: "ライフタイム" },
    ],
  },
] as const;

// ${lang_id}-${page_id} から言語名を取得
export function getLanguageName(docs_id: string) {
  const lang_id = docs_id.split("-")[0];
  const lang = pagesList.find((lang) => lang.id === lang_id)?.lang;
  if (!lang) {
    throw new Error(`Unknown language id: ${lang_id}`);
  }
  return lang;
}
