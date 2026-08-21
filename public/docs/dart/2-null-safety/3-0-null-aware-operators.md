---
id: dart-null-safety-null-aware-operators
title: 'Null認識演算子（?.、??、??=）'
level: 2
question:
  - Null認識演算子を使うとどのようなボイラープレートコードを削減できますか？
  - オプショナルチェーンとNull合流演算子の記号は何ですか？
term:
  - Null認識演算子
  - null認識演算子
  - オプショナルチェーン
  - '??'
  - '?.'
  - '??='
---

## Null認識演算子（`?.`、`??`、`??=`）

[[Dart]]には、Nullableな値を安全かつ簡潔に処理するための **[[Null認識演算子]]（Null-aware operators）** が用意されています。

これらを活用することで、冗長な `if (x != null)` チェックを大幅に減らすことができます。
