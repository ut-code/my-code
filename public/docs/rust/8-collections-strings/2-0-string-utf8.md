---
id: rust-collections-strings-string-utf8
title: 文字列 (String) と UTF-8
level: 2
question:
  - Rustの文字列が他の言語経験者にとって混乱しやすいとのことですが、具体的に何が一番混乱しやすい点ですか？
  - UTF-8エンコードされたバイトのコレクションとはどういう意味ですか？
---

## 文字列 (`String`) と UTF-8

Rustにおける文字列は、他の言語経験者にとって最も混乱しやすい部分の一つです。
Rustの文字列は、**UTF-8エンコードされたバイトのコレクション**として実装されています。
