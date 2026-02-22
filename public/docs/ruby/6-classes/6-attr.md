---
id: ruby-classes-6-attr
title: attr_* による自動定義
level: 3
---

### `attr_*` による自動定義

Rubyでは、上記のような定型的なアクセサメソッドを自動で定義するための便利な「マクロ」が用意されています。これらはクラス定義のトップレベルで使います。

  * `attr_reader :var` : ゲッター（読み取り専用）を定義します。
  * `attr_writer :var` : セッター（書き込み専用）を定義します。
  * `attr_accessor :var` : ゲッターとセッターの両方を定義します。

引数にはインスタンス変数名の`@`を除いた**シンボル**（`:`から始まる名前）を渡します。

```ruby:auto_accessor.rb
class Product
  # @name のゲッターとセッターを自動定義
  attr_accessor :name
  # @price のゲッターのみを自動定義 (読み取り専用)
  attr_reader :price
  # @stock のセッターのみを自動定義 (書き込み専用)
  attr_writer :stock

  def initialize(name, price, stock)
    @name = name
    @price = price
    @stock = stock
  end

  def summary
    # ゲッターは self.price とも書けるが、
    # クラス内部では @price と直接アクセスするのが一般的
    "商品: #{@name}, 価格: #{@price}円"
  end
end

item = Product.new("Mouse", 3000, 50)

# attr_accessor
puts item.name       # ゲッター
item.name = "Keyboard" # セッター
puts item.name

# attr_reader
puts item.price      # ゲッター
# item.price = 3500  # => NoMethodError (undefined method `price=')

# attr_writer
# puts item.stock    # => NoMethodError (undefined method `stock')
item.stock = 100     # セッター

puts item.summary
```

```ruby-exec:auto_accessor.rb
Mouse
Keyboard
3000
商品: Keyboard, 価格: 3000円
```
