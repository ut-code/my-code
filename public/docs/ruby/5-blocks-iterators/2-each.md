---
id: ruby-blocks-iterators-2-each
title: each
level: 3
---

### each

`each` は、コレクションの各要素を順番に取り出してブロックを実行します。他言語の `foreach` ループに最も近いものです。

`|n|` の部分は**ブロック引数**と呼ばれ、イテレータが取り出した要素（この場合は配列の各要素）を受け取ります。

```ruby-repl:2
irb(main):001:0> numbers = [1, 2, 3]
=> [1, 2, 3]

irb(main):002:0> numbers.each do |n|
irb(main):003:1* puts "Current number is #{n}"
irb(main):004:1> end
Current number is 1
Current number is 2
Current number is 3
=> [1, 2, 3]
```

> **Note:** `each` メソッドの戻り値は、元の配列 (`[1, 2, 3]`) 自身です。`each` はあくまで「繰り返すこと」が目的であり、ブロックの実行結果は利用しません。
