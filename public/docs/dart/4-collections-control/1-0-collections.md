---
id: dart-collections-types
title: List、Set、Map とジェネリクス
level: 2
question:
  - List、Set、Map の使い分けの基準は何ですか？
  - 型推論で要素の型が固定される仕組みを教えてください。
term:
  - List
  - Set
  - Map
  - コレクション
  - ジェネリクス
---

## `List`、`Set`、`Map` とジェネリクス

[[Dart]]の代表的なコレクション型には、**`List`**、**`Set`**、**`Map`** があります。

すべて[[ジェネリクス]]（`<T>`）に対応しており、要素の型がコンパイル時に厳格にチェックされます。
