---
id: ruby-classes-4-attr-reader-attr-wri
title: '🔐 アクセサ: attr_reader, attr_writer, attr_accessor'
level: 2
---

## 🔐 アクセサ: attr\_reader, attr\_writer, attr\_accessor

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
