---
id: ruby-classes-accessor
title: 🔐 アクセサメソッド
level: 2
question:
  - インスタンス変数を外部から直接参照・変更できないのは、なぜですか？
  - NoMethodErrorというエラーは、どのような場合に発生するのですか？
  - アクセサメソッドとは具体的に何をするためのメソッドですか？
---

## 🔐 アクセサメソッド

前述の通り、`@name`のようなインスタンス変数は外部から直接参照・変更できません。

```ruby:access_error.rb
class User
  def initialize(name)
    @name = name
  end
end

user = User.new("Alice")
p user.name  #=> NoMethodError
user.name = "Bob" #=> NoMethodError
```

```ruby-exec:access_error.rb
NoMethodError (undefined method `name'...)
```


外部からアクセスさせるためには、**アクセサメソッド**（ゲッターとセッター）を定義する必要があります。
