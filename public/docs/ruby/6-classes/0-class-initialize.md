---
id: ruby-classes-0-class-initialize
title: '💴 クラス定義: class, initialize'
level: 2
---

## 💴 クラス定義: class, initialize

Rubyでは、`class`キーワードを使ってクラスを定義します。クラス名は慣習として**大文字**で始めます（例: `MyClass`）。

`new`メソッドが呼ばれたときに実行される特別なメソッドが `initialize` です。これは他の言語における**コンストラクタ**に相当し、インスタンスの初期化処理を行います。

```ruby:user.rb
# クラス名はアッパーキャメルケース（PascalCase）で記述します
class User
  # newが呼ばれた際に自動的に実行される初期化メソッド
  def initialize(name, age)
    # インスタンス変数は @ で始める
    @name = name
    @age = age
    puts "Userオブジェクトが作成されました！"
  end
end

# クラスからインスタンスを生成
# User.new は initialize メソッドを呼び出す
user1 = User.new("Alice", 30)
user2 = User.new("Bob", 25)

p user1
p user2
```

```ruby-exec:user.rb
Userオブジェクトが作成されました！
Userオブジェクトが作成されました！
<User:0x0000... @name="Alice", @age=30>
<User:0x0000... @name="Bob", @age=25>
```
