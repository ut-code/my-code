---
id: rust-structs-methods-unit-structs
title: ユニット様構造体 (Unit-like Structs)
level: 3
question:
  - ユニット様構造体は、どのような場面で使われることが多いですか？
  - 「データを持たずに振る舞い（トレイト）だけを実装したい」とは、具体的にどういうことですか？
---

### ユニット様構造体 (Unit-like Structs)

フィールドを全く持たない構造体です。`struct AlwaysEqual;` のように定義します。これらは、データを持たずに振る舞い（トレイト）だけを実装したい場合に役立ちますが、詳細は後の章で扱います。
