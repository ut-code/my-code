---
id: ruby-basics-variable
title: 💎 変数、定数、スコープ
level: 2
---

## 💎 変数、定数、スコープ

Rubyの変数は型宣言を必要としませんが、変数の「スコープ（可視範囲）」は名前の付け方によって決まります。これは他の言語と大きく異なる点です。

  * **ローカル変数**: `my_var`
      * 小文字または `_` で始まります。定義されたスコープ（メソッド定義、ブロック、ファイルのトップレベルなど）でのみ有効です。
  * **インスタンス変数**: `@my_var`
      * `@` で始まります。特定のオブジェクトのインスタンスに属し、そのオブジェクトのメソッド内からアクセスできます。（クラスの章で詳述します）
  * **クラス変数**: `@@my_var`
      * `@@` で始まります。クラス全体とそのサブクラスで共有されます。（クラスの章で詳述します）
  * **グローバル変数**: `$my_var`
      * `$` で始まります。プログラムのどこからでもアクセス可能ですが、グローバルな状態を持つため、使用は最小限に抑えるべきです。
  * **定数**: `MY_CONSTANT`
      * 大文字で始まります。一度定義すると変更すべきではない値を示します（技術的には変更可能ですが、Rubyが警告を出します）。

```ruby-repl
irb(main):001> local_var = "I am local"
=> "I am local"
irb(main):002> @instance_var = "I belong to an object"
=> "I belong to an object"
irb(main):003> $global_var = "Available everywhere"
=> "Available everywhere"
irb(main):004> MY_CONSTANT = 3.14
=> 3.14
irb(main):005> MY_CONSTANT = 3.14159 # 警告が出ます
(irb):5: warning: already initialized constant MY_CONSTANT
(irb):4: warning: previous definition of MY_CONSTANT was here
=> 3.14159
```
