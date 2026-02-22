---
id: typescript-intro-0-typescript
title: TypeScriptとは？
level: 2
---

## TypeScriptとは？

TypeScriptは、Microsoftによって開発されているオープンソースのプログラミング言語です。一言で言えば、**「型（Type）を持ったJavaScript」**です。

重要な特徴は以下の通りです：

  * **JavaScriptのスーパーセット（上位互換）:** すべての有効なJavaScriptコードは、有効なTypeScriptコードでもあります。つまり、今日から既存のJS知識をそのまま活かせます。
  * **静的型付け:** JavaScriptは実行時に変数の型が決まる「動的型付け言語」ですが、TypeScriptはコンパイル時（コードを書いている途中やビルド時）に型をチェックする「静的型付け言語」としての性質を持ちます。
  * **コンパイル（トランスパイル）:** ブラウザやNode.jsはTypeScriptを直接理解できません。TypeScriptコンパイラ（`tsc`）を使って、標準的なJavaScriptファイルに変換してから実行します。
