---
id: ruby-classes-9-selfmethod-name
title: クラスメソッド (self.method_name)
level: 3
---

### クラスメソッド (self.method\_name)

インスタンスではなく、**クラス自体から呼び出すメソッド**です。`def self.メソッド名` のように `self.` をつけて定義します。

  * `User.new` の `new` も、実はクラスメソッドの一種です。
  * インスタンス変数 (`@var`) にはアクセスできません（インスタンスが存在しないため）。
  * クラス変数 (`@@var`) にはアクセスできます。
  * ファクトリメソッド（特定のパターンのインスタンスを生成するメソッド）や、クラス全体に関わる操作（例: 総数のカウント）によく使われます。

```ruby:counter.rb
class Counter
  # クラス変数（クラス全体で共有）
  @@total_count = 0

  attr_reader :id

  def initialize(id)
    @id = id
    # インスタンスが作られるたびにクラス変数を増やす
    @@total_count += 1
  end

  # クラスメソッド (self. をつける)
  # クラス変数を返す
  def self.total_count
    @@total_count
  end

  # インスタンスメソッド
  def report_total
    # インスタンスメソッドからもクラス変数を参照できる
    "私のIDは #{@id} です。総数は #{@@total_count} です。"
  end
end

# クラスメソッドの呼び出し
puts "初期カウント: #{Counter.total_count}" #=> 0

c1 = Counter.new(1)
c2 = Counter.new(2)

# クラスメソッドの呼び出し
puts "最終カウント: #{Counter.total_count}" #=> 2

# インスタンスメソッドの呼び出し
puts c1.report_total #=> 私のIDは 1 です。総数は 2 です。
puts c2.report_total #=> 私のIDは 2 です。総数は 2 です。

# c1.total_count #=> NoMethodError (インスタンスからは呼べない)
```

```ruby-exec:counter.rb
初期カウント: 0
最終カウント: 2
私のIDは 1 です。総数は 2 です。
私のIDは 2 です。総数は 2 です。
```
