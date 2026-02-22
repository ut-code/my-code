---
id: python-intro-0-python
title: 'Pythonの思想と特徴: 「読みやすさ」は最優先'
level: 2
---

## Pythonの思想と特徴: 「読みやすさ」は最優先

他の言語（Java, C++, PHPなど）と比較したとき、Pythonが最も重視するのは**コードの可読性（Readability）**です。

* **シンプルな文法:** C言語やJavaのような `{}`（波括弧）によるブロックや、行末の `;`（セミコロン）を必要としません。
* **強制的なインデント:** Pythonは、**インデント（字下げ）**そのものでコードブロックを表現します。これは構文的なルールであり、オプションではありません。これにより、誰が書いても（ある程度）同じような見た目のコードになり、可読性が劇的に向上します。
* **動的型付け (Dynamic Typing):** JavaやC++のように `int num = 10;` と変数の型を明示的に宣言する必要がありません。`num = 10` と書けば、Pythonが実行時に自動的に型を推論します。（これはJavaScriptやPHPと似ていますが、Pythonは型付けがより厳格（Strong Typing）で、例えば文字列と数値を暗黙的に連結しようとするとエラーになります）
* **豊富な標準ライブラリ**: 「Batteries Included（バッテリー同梱）」という思想のもと、OS操作、ネットワーク、データ処理、JSON、正規表現など、多くの機能が最初から標準ライブラリとして提供されています。

**💡 The Zen of Python (Pythonの禅)** Pythonの設計思想は、`import this` というコマンドでいつでも確認できます。

* Beautiful is better than ugly. (醜いより美しいほうがいい)
* Explicit is better than implicit. (暗黙的より明示的なほうがいい)
* Simple is better than complex. (複雑であるよりシンプルなほうがいい)
