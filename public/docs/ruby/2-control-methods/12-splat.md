---
id: ruby-control-methods-12-splat
title: 可変長引数 (Splat演算子)
level: 3
---

### 可変長引数 (Splat演算子)

引数の先頭に `*`（Splat演算子）を付けると、任意の数の引数を配列として受け取ることができます。

```ruby-repl:6
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
