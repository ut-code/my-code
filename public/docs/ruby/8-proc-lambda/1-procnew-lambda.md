---
id: ruby-proc-lambda-1-procnew-lambda
title: Proc.new と lambda の違い
level: 2
---

## Proc.new と lambda の違い

`Proc` オブジェクトを作成するもう一つの方法として `lambda` があります。（`->` というリテラル構文もよく使われます）

```ruby-repl:4
irb(main):007:0> adder_lambda = lambda { |a, b| a + b }
=> #<Proc:0x000002b5b86bba40@(irb):7 (lambda)>
irb(main):008:0> adder_lambda.call(3, 4)
=> 7

irb(main):009:0> subtractor_lambda = ->(x, y) { x - y }
=> #<Proc:0x000002b5b86060c8@(irb):9 (lambda)>
irb(main):010:0> subtractor_lambda.call(10, 3)
=> 7
```

`lambda` で作成されたオブジェクトも `Proc` クラスのインスタンスですが、`Proc.new` (または `proc`) で作成されたものとは、主に以下の2点で挙動が異なります。
