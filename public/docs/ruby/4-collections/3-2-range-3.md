---
id: ruby-collections-range-3
title: ... (終端を含まない)
level: 3
question:
  - (1...10) の「未満」という概念がよく理解できません。具体的にどう違いますか？
  - inclusive_range.include?(10)とexclusive_range.include?(10)の結果が違うのはなぜですか？
---

### `...` (終端を含まない)

`...`（ドット3つ）は、終端の値を含まない（未満の）範囲を作成します。

```ruby-repl
irb(main):004:0> exclusive_range = (1...10) # 1から10まで (10を含まない)
=> 1...10
irb(main):005:0> exclusive_range.to_a
=> [1, 2, 3, 4, 5, 6, 7, 8, 9]
irb(main):006:0> exclusive_range.include?(10)
=> false
```
