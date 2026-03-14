---
id: ruby-proc
title: 'ブロックをオブジェクトとして扱う: Proc クラス'
level: 2
question:
  - ブロックとは何ですか？
  - Procクラスを使うと何が嬉しいのですか？
  - Proc.newとprocは全く同じものとして使って良いのですか？
  - Procオブジェクトの出力例にある「#<Proc:0x...>」は何を意味しますか？
  - greeter.call("Alice")とするとHello, Alice!と表示された後、=> nilと出るのはなぜですか？
---

## ブロックをオブジェクトとして扱う: `Proc` クラス

ブロックは、それ自体ではオブジェクトではありません。しかし、Rubyにはブロックをオブジェクト化するための `Proc` クラスが用意されています。

`Proc.new` にブロックを渡すことで、`Proc` オブジェクトを作成できます。

作成した `Proc` オブジェクトは、`call` メソッドを使って実行できます。

```ruby-repl
irb(main):001:0> greeter = Proc.new { |name| puts "Hello, #{name}!" }
irb(main):002:0> greeter
=> #<Proc:0x000002b5b882f0f0@(irb):1>
irb(main):003:0> greeter.call("Alice")
Hello, Alice!
=> nil
irb(main):004:0> greeter.call("Bob")
Hello, Bob!
=> nil
```

`proc` という `Proc.new` のエイリアスメソッドもよく使われます。

```ruby
greeter = proc { |name| puts "Hello, #{name}!" }
```
