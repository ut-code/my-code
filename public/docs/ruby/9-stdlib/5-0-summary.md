---
id: ruby-stdlib-summary
title: この章のまとめ
level: 2
question:
  - 標準ライブラリとは何ですか？
  - requireが必要なライブラリと不要なライブラリの見分け方はありますか？
  - CSVの処理やHTTP通信など、具体的にどのような時に使うのですか？
---

## この章のまとめ

  * Rubyには、`require` でロードできる豊富な**標準ライブラリ**が付属しています。
  * **File**クラスはファイルの読み書きを、**Pathname**はパス操作をオブジェクト指向的に行います。
  * **Time**は時刻を、**Date**は日付を扱います。`strftime` でフォーマットできます。
  * **json**ライブラリは `JSON.parse`（文字列→Hash）と `to_json`（Hash→文字列）を提供します。
  * **Regexp**（`/pattern/`）はパターンマッチングに使います。`String#match` で `MatchData` を取得し、`scan` や `gsub` で検索・置換を行います。

これらは標準ライブラリのごく一部です。他にもCSVの処理 (`csv`)、HTTP通信 (`net/http`)、テスト (`minitest`) など、多くの機能が提供されています。
