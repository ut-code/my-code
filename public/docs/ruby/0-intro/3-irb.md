---
id: ruby-intro-3-irb
title: 対話型シェル（irb）の活用
level: 2
---

## 対話型シェル（irb）の活用

Rubyのインストールが完了したら、`irb` (Interactive Ruby) を起動してみましょう。これはRubyのREPL (Read-Eval-Print Loop) で、コード片を試したり、ドキュメント代わりに使ったりするのに非常に便利です。

ターミナルで`irb`と入力することで起動できます。

このウェブサイトではドキュメント内にRubyの実行環境を埋め込んでいます。
以下のように青枠で囲われたコード例には自由にRubyコードを書いて試すことができます。

```ruby-repl:2
irb(main):001> 10 * (5 + 3)
=> 80
irb(main):002> "Ruby".length
=> 4
irb(main):003> 3.times { puts "Welcome!" }
Welcome!
Welcome!
Welcome!
=> 3
```

`=>` の右側に表示されているのが、式の**評価結果（返り値）**です。

`3.times`の例に注目してください。`puts "Welcome!"`が3回実行（出力）されていますが、`=> 3`と表示されています。これは、`3.times`というメソッド自体の返り値が`3`（レシーバである数値）であることを示しています。Rubyではすべての式が値を返すことを覚えておいてください。
