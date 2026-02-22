---
id: ruby-proc-lambda-0-proc
title: 'ブロックをオブジェクトとして扱う: Proc クラス'
level: 2
---

## ブロックをオブジェクトとして扱う: Proc クラス

ブロックは、それ自体ではオブジェクトではありません。しかし、Rubyにはブロックをオブジェクト化するための `Proc` クラスが用意されています。

`Proc.new` にブロックを渡すことで、`Proc` オブジェクトを作成できます。

```ruby-repl:1
irb(main):001:0> greeter = Proc.new { |name| puts "Hello, #{name}!" }
irb(main):002:0> greeter
=> #<Proc:0x000002b5b882f0f0@(irb):1>
```

作成した `Proc` オブジェクトは、`call` メソッドを使って実行できます。

```ruby-repl:2
irb(main):003:0> greeter.call("Alice")
Hello, Alice!
=> nil
irb(main):004:0> greeter.call("Bob")
Hello, Bob!
=> nil
```

`proc` という `Proc.new` のエイリアスメソッドもよく使われます。

```ruby-repl:3
irb(main):005:0> multiplier = proc { |x| x * 2 }
=> #<Proc:0x000002b5b877e8a8@(irb):5>
irb(main):006:0> multiplier.call(10)
=> 20
```
