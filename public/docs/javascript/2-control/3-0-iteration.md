---
id: javascript-control-iteration
title: 'イテレーション: for...of と for...in の違い'
level: 2
---

## イテレーション: `for...of` と `for...in` の違い

現代のJavaScript開発において、最も重要なのがこの2つのループの使い分けです。これらは似ていますが、役割が明確に異なります。

| 構文 | 取得するもの | 対象 | 推奨ユースケース |
| :--- | :--- | :--- | :--- |
| **`for...in`** | **キー (Key)** | Object | オブジェクトのプロパティ調査 |
| **`for...of`** | **値 (Value)** | Array, String, Map, Set | 配列やリストデータの処理 |
