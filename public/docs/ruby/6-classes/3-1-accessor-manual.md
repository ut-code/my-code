---
id: ruby-classes-accessor-manual
title: 手動での定義
level: 3
question:
  - ゲッターとセッターという用語の意味を教えてください。
  - def name=(new_name)のように、メソッド名にイコール記号が含まれるのはなぜですか？
  - item.name = "Desktop"と書いたとき、Rubyの内部ではどのようにセッターメソッドが呼び出されるのですか？
---

### 手動での定義

JavaやC\#のように、ゲッターとセッターを明示的に書くこともできます。

```ruby:manual_accessor.rb
class Product
  def initialize(name)
    @name = name
  end

  # ゲッター (値の読み取り)
  def name
    @name
  end

  # セッター (値の書き込み)
  # メソッド名が = で終わるのが特徴
  def name=(new_name)
    @name = new_name
  end
end

item = Product.new("Laptop")
puts item.name         # ゲッター(item.name)の呼び出し
item.name = "Desktop"  # セッター(item.name=)の呼び出し
puts item.name
```

```ruby-exec:manual_accessor.rb
Laptop
Desktop
```
