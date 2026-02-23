---
id: ruby-collections-array
title: 配列 (Array)
level: 2
---

## 配列 (Array)

Rubyの `Array` は、他の言語における動的配列やリストに似ています。順序付けられた要素のコレクションであり、異なるデータ型の要素を混在させることができます。

配列は `[]` (角括弧) を使って生成します。

要素へのアクセスは `[index]` を使います。Rubyのインデックスは0から始まり、**負のインデックス**（末尾からのアクセス）をサポートしているのが特徴です。

```ruby-repl
irb(main):001:0> numbers = [1, 2, 3, 4, 5]
=> [1, 2, 3, 4, 5]
irb(main):002:0> numbers[0]  # 最初の要素
=> 1
irb(main):003:0> numbers[-1] # 末尾の要素
=> 5
irb(main):004:0> numbers[-2] # 末尾から2番目の要素
=> 4
irb(main):005:0> mixed = [1, "hello", true, 3.14] # 型の混在が可能
=> [1, "hello", true, 3.14]
irb(main):006:0> empty_array = []
=> []
```
