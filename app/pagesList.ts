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
    id: "cpp",
    lang: "C++",
    description: "C++の基本から高度な機能までを学べるチュートリアル",
    pages: [
      { id: 1, title: "C++の世界へようこそ" },
      { id: 2, title: "型システムとメモリ" },
      { id: 3, title: "関数と参照" },
      { id: 4, title: "ポインタと動的メモリ" },
      { id: 5, title: "クラスの基礎" },
      { id: 6, title: "クラスを使いこなす" },
      { id: 7, title: "継承とポリモーフィズム" },
      { id: 8, title: "テンプレート" },
      { id: 9, title: "STL ①:コンテナ" },
      { id: 10, title: "STL ②:アルゴリズムとラムダ式" },
      { id: 11, title: "RAIIとスマートポインタ" },
      { id: 12, title: "プロジェクトの分割とビルド" },
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
