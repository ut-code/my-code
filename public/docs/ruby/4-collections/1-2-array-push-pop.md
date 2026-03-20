---
id: ruby-collections-array-push-pop
title: 要素の追加と削除
level: 3
question:
  - << と push の違いは何ですか？どちらを使うのが良いですか？
  - pop メソッドは配列から複数の要素を削除できますか？
  - 配列の先頭の要素を追加したり削除したりするにはどうすればいいですか？
  - popで削除した要素は元に戻せますか？
---

### 要素の追加と削除

要素の追加には `<<` (shovel演算子) や `push` メソッドを使います。 `pop` は末尾の要素を削除し、それを返します。

```ruby-repl
irb(main):007:0> fruits = ["apple", "banana"]
=> ["apple", "banana"]
irb(main):008:0> fruits << "cherry"  # << (shovel) は高速で一般的
=> ["apple", "banana", "cherry"]
irb(main):009:0> fruits.push("orange")
=> ["apple", "banana", "cherry", "orange"]
irb(main):010:0> last_fruit = fruits.pop
=> "orange"
irb(main):011:0> fruits
=> ["apple", "banana", "cherry"]
```
