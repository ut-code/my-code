// docs_id = `${group.id}-${page.id}`
export const pagesList = [
  {
    id: "python",
    lang: "Python",
    // TODO: これをいい感じの文章に変える↓
    description: "Pythonの基礎から応用までを学べるチュートリアル",
    pages: [
      { id: 1, slug: "0-intro", title: "環境構築と基本思想" },
      { id: 2, slug: "1-basics", title: "基本構文とデータ型" },
      { id: 3, slug: "2-collections", title: "リスト、タプル、辞書、セット" },
      { id: 4, slug: "3-control-functions", title: "制御構文と関数" },
      { id: 5, slug: "4-modules", title: "モジュールとパッケージ" },
      { id: 6, slug: "5-oop", title: "オブジェクト指向プログラミング" },
      {
        id: 7,
        slug: "6-file-io",
        title: "ファイルの入出力とコンテキストマネージャ",
      },
      { id: 8, slug: "7-exceptions", title: "例外処理" },
      { id: 9, slug: "8-generators-decorators", title: "ジェネレータとデコレータ" },
    ],
  },
  {
    id: "ruby",
    lang: "Ruby",
    description: "hoge",
    pages: [
      { id: 1, slug: "0-intro", title: "rubyの世界へようこそ" },
      { id: 2, slug: "1-basics", title: "基本構文とデータ型" },
      { id: 3, slug: "2-control-methods", title: "制御構造とメソッド定義" },
      { id: 4, slug: "3-everything-object", title: "すべてがオブジェクト" },
      { id: 5, slug: "4-collections", title: "コレクション (Array, Hash, Range)" },
      { id: 6, slug: "5-blocks-iterators", title: "ブロックとイテレータ" },
      { id: 7, slug: "6-classes", title: "クラスとオブジェクト" },
      { id: 8, slug: "7-modules", title: "モジュールとMix-in" },
      { id: 9, slug: "8-proc-lambda", title: "Proc, Lambda, クロージャ" },
      { id: 10, slug: "9-stdlib", title: "標準ライブラリの活用" },
      { id: 11, slug: "10-testing", title: "テスト文化入門" },
      { id: 12, slug: "11-metaprogramming", title: "メタプログラミング入門" },
    ],
  },
  {
    id: "javascript",
    lang: "JavaScript",
    description: "hoge",
    pages: [
      { id: 1, slug: "0-intro", title: "JavaScriptへようこそ" },
      { id: 2, slug: "1-basics", title: "基本構文とデータ型" },
      { id: 3, slug: "2-control", title: "制御構文" },
      { id: 4, slug: "3-functions-closures", title: "関数とクロージャ" },
      { id: 5, slug: "4-this", title: "'this'の正体" },
      { id: 6, slug: "5-objects-prototype", title: "オブジェクトとプロトタイプ" },
      { id: 7, slug: "6-classes", title: "クラス構文" },
      { id: 8, slug: "7-arrays", title: "配列とイテレーション" },
      { id: 9, slug: "8-promise", title: "非同期処理①: Promise" },
      { id: 10, slug: "9-async-await", title: "非同期処理②: Async/Await" },
    ],
  },
  {
    id: "typescript",
    lang: "TypeScript",
    description: "にゃー",
    pages: [
      { id: 1, slug: "0-intro", title: "TypeScriptへようこそ" },
      { id: 2, slug: "1-types", title: "基本的な型と型推論" },
      { id: 3, slug: "2-objects-interfaces", title: "オブジェクト、インターフェース、型エイリアス" },
      { id: 4, slug: "3-function-types", title: "関数の型定義" },
      { id: 5, slug: "4-combining-types", title: "型を組み合わせる" },
      { id: 6, slug: "5-generics", title: "ジェネリクス" },
      { id: 7, slug: "6-classes", title: "クラスとアクセス修飾子" },
      { id: 8, slug: "7-async-utilities", title: "非同期処理とユーティリティ型" },
    ],
  },
  {
    id: "cpp",
    lang: "C++",
    description: "C++の基本から高度な機能までを学べるチュートリアル",
    pages: [
      { id: 1, slug: "0-intro", title: "C++の世界へようこそ" },
      { id: 2, slug: "1-types-control", title: "型システムと制御構造" },
      { id: 3, slug: "2-data-containers", title: "データ集合とモダンな操作" },
      { id: 4, slug: "3-pointers", title: "ポインタとメモリ管理" },
      { id: 5, slug: "4-functions", title: "関数と参照渡し" },
      { id: 6, slug: "5-project-build", title: "プロジェクトの分割とビルド" },
      { id: 7, slug: "6-classes-basics", title: "クラスの基礎" },
      { id: 8, slug: "7-classes-advanced", title: "クラスを使いこなす" },
      { id: 9, slug: "8-inheritance", title: "継承とポリモーフィズム" },
      { id: 10, slug: "9-templates", title: "テンプレート" },
      { id: 11, slug: "10-stl-containers", title: "STL ①:コンテナ" },
      { id: 12, slug: "11-stl-algorithms", title: "STL ②:アルゴリズムとラムダ式" },
      { id: 13, slug: "12-raii-smart-ptrs", title: "RAIIとスマートポインタ" },
    ],
  },
  {
    id: "rust",
    lang: "Rust",
    description: "a",
    pages: [
      { id: 1, slug: "0-intro", title: "Rustの世界へようこそ" },
      { id: 2, slug: "1-basics", title: "基本構文と「不変性」" },
      { id: 3, slug: "2-functions-control", title: "関数と制御フロー" },
      { id: 4, slug: "3-ownership", title: "所有権" },
      { id: 5, slug: "4-borrowing-slices", title: "借用とスライス" },
      { id: 6, slug: "5-structs-methods", title: "構造体とメソッド構文" },
      { id: 7, slug: "6-enums-pattern", title: "列挙型とパターンマッチ" },
      { id: 8, slug: "7-modules", title: "モジュールシステムとパッケージ管理" },
      { id: 9, slug: "8-collections-strings", title: "コレクションと文字列" },
      { id: 10, slug: "9-error-handling", title: "エラーハンドリング" },
      { id: 11, slug: "10-generics-traits", title: "ジェネリクスとトレイト" },
      { id: 12, slug: "11-lifetimes", title: "ライフタイム" },
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
