---
id: ruby-proc-lambda-6-proc
title: 2. Proc をブロックとして渡す
level: 3
---

### 2\. Proc をブロックとして渡す

逆に、メソッドを呼び出す際に、`Proc` オブジェクトを `&` 付きで渡すと、その `Proc` オブジェクトがブロックとしてメソッドに渡されます。

`Array#map` メソッドは通常ブロックを受け取りますが、`Proc` オブジェクトを `&` を使って渡すことができます。

```ruby-repl:7
irb(main):001:0> numbers = [1, 2, 3, 4, 5]
=> [1, 2, 3, 4, 5]

irb(main):002:0> # 2倍にする Proc オブジェクト
irb(main):003:0> doubler = proc { |n| n * 2 }
=> #<Proc:0x000002b5b8828f70@(irb):3>

irb(main):004:0> # & を使って Proc をブロックとして map メソッドに渡す
irb(main):005:0> numbers.map(&doubler)
=> [2, 4, 6, 8, 10]
```

これは、以下のコードと等価です。

```ruby-repl:8
irb(main):006:0> numbers.map { |n| n * 2 }
=> [2, 4, 6, 8, 10]
```

`&` は、`Proc` とブロック（メソッド呼び出しに付随するコード）の間の架け橋となる重要な演算子です。
