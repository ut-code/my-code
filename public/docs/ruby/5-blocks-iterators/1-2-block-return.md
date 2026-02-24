---
id: ruby-blocks-return
title: ブロックの戻り値
level: 3
---

### ブロックの戻り値

（Rubyのすべての式と同様に）ブロックも戻り値を持ちます。ブロックの戻り値とは、**ブロック内で最後に評価された式の値**です。

```ruby-repl
irb(main):021:0> result = [1, 2].map do |n|
irb(main):022:1* m = n * 10       # mは 10, 20
irb(main):023:1* m + 5            # ブロックの戻り値 (15, 25)
irb(main):024:1> end
=> [15, 25]
```
