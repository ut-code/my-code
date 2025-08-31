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
      { id: 2, title: "型システムとメモリ" },
      { id: 3, title: "関数と参照" },
    ],
  },
] as const;
