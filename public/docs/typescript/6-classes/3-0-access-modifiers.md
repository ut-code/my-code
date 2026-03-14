---
id: typescript-classes-access-modifiers
title: 'アクセス修飾子: public, private, protected'
level: 2
question:
  - public、private、protected はそれぞれどのような時に使うべきですか？
  - これらのアクセス修飾子を付けないと、デフォルトでは何になりますか？
  - アクセス修飾子を使うことで、具体的にどのようなメリットがありますか？
  - JavaScriptにはこれらの概念がないと思うのですが、TypeScript独自のものですか？
---

## アクセス修飾子: public, private, protected

TypeScriptには、クラスのメンバー（プロパティやメソッド）へのアクセスを制御するための3つの修飾子があります。これはJavaやC\#などの言語と同様の概念です。

1.  **`public` (デフォルト)**: どこからでもアクセス可能。
2.  **`private`**: 定義されたクラスの内部からのみアクセス可能。
3.  **`protected`**: 定義されたクラス、およびそのサブクラス（継承先）からアクセス可能。
