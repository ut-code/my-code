---
id: rust-basics-let-mut
title: 変数と可変性（let vs let mut）
level: 2
question:
  - letとlet mutの違いは何ですか？
  - mutは何の略で、どのような意味があるのですか？
---

## 変数と可変性（let vs let mut）

Rustでは変数を宣言するために `let` キーワードを使用します。しかし、単に `let` で宣言された変数は、値を一度代入すると二度と変更できません。
