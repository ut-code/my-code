---
id: ruby-iterators-select
title: select (filter)
level: 3
question:
  - select と filter は全く同じ機能なら、どちらを使うべきですか？
  - ブロックの戻り値が「真 (true)」になる条件とは、具体的にどのような場合ですか？ falseやnilでなければ何でも良いのですか？
  - n.even? のようにメソッド名に「?」が付いているのは何か特別な意味がありますか？
---

### `select` (`filter`)

`select` は、各要素に対してブロックを実行し、ブロックの戻り値が**真 (true)** になった要素だけを集めた**新しい配列**を返します。

```ruby-repl
irb(main):009:0> numbers = [1, 2, 3, 4, 5, 6]
=> [1, 2, 3, 4, 5, 6]

irb(main):010:0> evens = numbers.select { |n| n.even? } # n.even? は n % 2 == 0 と同じ
=> [2, 4, 6]
```
