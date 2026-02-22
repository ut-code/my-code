---
id: ruby-blocks-iterators-6-enumerable
title: Enumerableモジュール：イテレーションの力
level: 2
---

## Enumerableモジュール：イテレーションの力

`each`, `map`, `select`, `find` といった便利なメソッドは、実は `Enumerable`（エニューメラブル）という**モジュール**によって提供されています。

`Enumerable` はRubyの「Mix-in（ミックスイン）」機能の代表例です。これは、クラスに「混ぜ込む」ことで、そのクラスのインスタンスに特定の機能（メソッド群）を追加する仕組みです。

`Enumerable` をMix-inするクラス（例えば `Array` や `Hash`, `Range`）が満たすべき契約はただ一つ、**`each` メソッドを実装すること**です。

`each` メソッドさえ定義されていれば、`Enumerable` モジュールは `each` を使って `map`, `select`, `find`, `sort`, `count` など、数十もの便利なイテレーションメソッドを自動的に提供してくれます。

例えば、`Array` クラスは `each` を持っています。

```ruby-repl:6
irb(main):014:0> numbers = [1, 2, 3]
=> [1, 2, 3]
# numbers (Array) は each を持っているので...
irb(main):015:0> numbers.map { |n| n * 2 }  # map が使える
=> [2, 4, 6]
irb(main):016:0> numbers.select { |n| n.odd? } # select が使える
=> [1, 3]
```

これは、自分で新しいコレクションクラスを作った場合でも同様です。（`include` については後の「モジュールとMix-in」の章で詳しく学びます）

```ruby:my_collection.rb
# Enumerableモジュールを include する
class MyCollection
  include Enumerable # これがMix-in

  def initialize(items)
    @items = items
  end

  # Enumerable のために each メソッドを定義する
  def each
    @items.each do |item|
      yield(item) # ブロックに要素を渡す
    end
  end
end

collection = MyCollection.new([10, 20, 30])

# each を定義しただけで、map が使える！
doubled = collection.map { |x| x * 2 }
puts "Map result: #{doubled.inspect}"

# select も使える！
selected = collection.select { |x| x > 15 }
puts "Select result: #{selected.inspect}"
```

```ruby-exec:my_collection.rb
Map result: [20, 40, 60]
Select result: [20, 30]
```

このように、Rubyのイテレータの強力さは `Enumerable` モジュールによって支えられています。Rubyでは、**「`each` メソッドを持つものは、すべて `Enumerable` である（あるいはそう振る舞える）」**という考え方が非常に重要です。
