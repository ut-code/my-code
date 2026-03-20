---
id: ruby-classes-instance-var-method
title: 🏃‍♂️ インスタンス変数 (@var) とインスタンスメソッド
level: 2
question:
  - インスタンス変数と、initializeメソッドの引数であるnameやageのような普通の変数の違いは何ですか？
  - インスタンス変数が外部から直接アクセスできない（カプセル化）とはどういう意味ですか？
  - インスタンスメソッドのgreet内で@nameや@ageを使うとき、なぜ引数として渡さなくて良いのですか？
  - カプセル化とは何ですか？なぜ必要なのですか？
---

## 🏃‍♂️ インスタンス変数 (`@var`) とインスタンスメソッド

`@`で始まる変数（例: `@name`）は**インスタンス変数**です。

  * そのクラスのインスタンス（オブジェクト）ごとに個別に保持されます。
  * `initialize`や他のインスタンスメソッド内で定義・参照されます。
  * **デフォルトで外部から直接アクセスすることはできません（カプセル化）**。

`def`で定義されたメソッド（`initialize`を除く）が**インスタンスメソッド**です。これらはインスタンスの「振る舞い」を定義し、そのインスタンスのインスタンス変数（`@var`）にアクセスできます。

```ruby:user_greet.rb
class User
  def initialize(name, age)
    @name = name
    @age = age
  end

  # インスタンスメソッドの定義
  def greet
    # メソッド内からインスタンス変数（@name, @age）を参照
    puts "こんにちは、#{@name}さん (#{@age}歳) です。"
  end
end

user1 = User.new("Alice", 30)

# インスタンスメソッドの呼び出し
user1.greet
```

```ruby-exec:user_greet.rb
こんにちは、Aliceさん (30歳) です。
```
