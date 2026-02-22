---
id: ruby-blocks-iterators-3-map-collect
title: map (collect)
level: 3
---

### map (collect)

`map` は、各要素に対してブロックを実行し、その**ブロックの戻り値**を集めた**新しい配列**を返します。

```ruby-repl:3
irb(main):005:0> numbers = [1, 2, 3]
=> [1, 2, 3]

irb(main):006:0> doubled = numbers.map { |n| n * 2 }
=> [2, 4, 6]

irb(main):007:0> puts doubled.inspect
[2, 4, 6]
=> nil

irb(main):008:0> puts numbers.inspect # 元の配列は変更されない
[1, 2, 3]
=> nil
```

`map` は、元の配列を変換した新しい配列が欲しい場合に非常に便利です。
