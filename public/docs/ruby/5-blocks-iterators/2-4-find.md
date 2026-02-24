---
id: ruby-iterators-find
title: find (detect)
level: 3
---

### `find` (`detect`)

`find` は、ブロックの戻り値が**真 (true)** になった**最初の要素**を返します。見つからなければ `nil` を返します。

```ruby-repl
irb(main):011:0> numbers = [1, 2, 3, 4, 5, 6]
=> [1, 2, 3, 4, 5, 6]

irb(main):012:0> first_even = numbers.find { |n| n.even? }
=> 2

irb(main):013:0> over_10 = numbers.find { |n| n > 10 }
=> nil
```
