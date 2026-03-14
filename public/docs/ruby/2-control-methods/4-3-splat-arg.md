---
id: ruby-methods-splat-arg
title: 可変長引数 (Splat演算子)
level: 3
question:
  - 可変長引数と通常の引数を混ぜる場合、引数の順序にルールはありますか？
  - 複数の可変長引数を一つのメソッド内で定義することは可能ですか？
  - 引数がない場合に空の配列として扱われるのは便利ですか？
---

### 可変長引数 (Splat演算子)

引数の先頭に `*`（Splat演算子）を付けると、任意の数の引数を配列として受け取ることができます。

```ruby-repl
irb(main):006:0> def summarize(*items)
irb(main):007:1* puts "Items count: #{items.length}"
irb(main):008:1* puts "Items: #{items.join(', ')}"
irb(main):009:1* end
=> :summarize
irb(main):010:0> summarize("Apple", "Banana", "Orange")
Items count: 3
Items: Apple, Banana, Orange
=> nil
irb(main):011:0> summarize("Book")
Items count: 1
Items: Book
=> nil
irb(main):012:0> summarize
Items count: 0
Items: 
=> nil
```
