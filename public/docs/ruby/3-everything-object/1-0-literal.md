---
id: ruby-everything-object-literal
title: '🎯 Rubyの核心: 5.times の衝撃'
level: 2
question:
  - 5という数値がオブジェクトだとはどういう意味ですか？
  - なぜ数値や文字列がオブジェクトであることが重要なのでしょうか？
  - .classメソッドは何のために使うのですか？
  - 他のプログラミング言語では数値はオブジェクトではないのが一般的なのですか？
  - リテラルとは何ですか？
---

## 🎯 Rubyの核心: 5.times の衝撃

他の言語の経験者がRubyに触れて最初に驚くことの一つが、以下のようなコードが動作することです。

```ruby
5.times do
    print "Ruby! "
end
# Ruby! Ruby! Ruby! Ruby! Ruby! が出力される
```

`5` という数値リテラルが `.times` というメソッドを呼び出しています。これは、`5` が単なる値ではなく、`Integer` クラスのインスタンス（オブジェクト）だからです。

同様に、文字列もオブジェクトです。

```ruby
"hello, world".upcase
# => "HELLO, WORLD"
"hello, world".length
# => 12
```

`"hello, world"` という `String` オブジェクトが、`upcase` や `length` というメソッド（メッセージ）に応答しています。

`.class` メソッドを使うと、そのオブジェクトがどのクラスに属しているかを確認できます。

```ruby-repl
irb(main):001:0> 5.class
=> Integer
irb(main):002:0> "hello".class
=> String
irb(main):003:0> 3.14.class
=> Float
```
