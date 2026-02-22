---
id: ruby-classes-11-super
title: super
level: 3
---

### `super`

子クラスで親クラスと同じ名前のメソッドを定義（**オーバーライド**）した際、`super`キーワードを使うと、**親クラスの同名メソッドを呼び出す**ことができます。

これは特に `initialize` メソッドで、親クラスの初期化処理を呼び出すために必須となります。

```ruby:vehicle.rb
# 親クラス (スーパークラス)
class Vehicle
  attr_reader :name

  def initialize(name)
    @name = name
    puts "Vehicleを初期化中: #{@name}"
  end

  def move
    puts "#{@name} は移動します。"
  end
end

# 子クラス (サブクラス)
# Vehicle クラスを継承
class Car < Vehicle
  def initialize(name, color)
    # super で親クラスの initialize を呼び出す
    # (name を渡す)
    super(name)
    @color = color
    puts "Carを初期化中: 色は#{@color}"
  end

  # move メソッドをオーバーライド (上書き)
  def move
    # super で親クラスの move メソッドを呼び出す
    super
    # Car 固有の処理を追加
    puts "車輪が回転します。"
  end
end

my_car = Car.new("MyCar", "Red")
puts "---"
my_car.move
```

```ruby-exec:vehicle.rb
Vehicleを初期化中: MyCar
Carを初期化中: 色はRed
---
MyCar は移動します。
車輪が回転します。
```

`super` は引数を省略すると、現在のメソッドが受け取った引数をそのまま親メソッドに渡します。`super()` のように `()` をつけると、引数なしで親メソッドを呼び出します。
