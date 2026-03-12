---
id: ruby-methods-default-arg
title: デフォルト引数
level: 3
question:
  - デフォルト引数と通常の引数を混ぜる場合、引数の順序にルールはありますか？
  - デフォルト引数の値として、他の引数の値を使うことはできますか？
---

### デフォルト引数

引数にデフォルト値を設定できます。

```ruby-repl
irb(main):001:0> def greet(name = "Guest")
irb(main):002:1* "Hello, #{name}!"
irb(main):003:1* end
=> :greet
irb(main):004:0> greet("Alice")
=> "Hello, Alice!"
irb(main):005:0> greet
=> "Hello, Guest!"
```
