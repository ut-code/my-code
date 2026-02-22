---
id: ruby-metaprogramming-2-define-method
title: 'define_method: メソッドを動的に定義する'
level: 2
---

## define\_method: メソッドを動的に定義する

メソッドを動的に（実行時に）定義したい場合、`define_method` を使用します。これは主にクラスやモジュールの定義内で使われます。

`define_method` は、第1引数に定義したいメソッド名（シンボル）を、第2引数にブロック（ProcやLambda）を取ります。このブロックが、新しく定義されるメソッドの本体となります。

例えば、似たようなメソッドを多数定義する必要がある場合に非常に便利です。

```ruby:dynamic_greeter.rb
class DynamicGreeter
  # 定義したい挨拶のリスト
  GREETINGS = {
    hello: "Hello",
    goodbye: "Goodbye",
    hi: "Hi"
  }

  GREETINGS.each do |name, prefix|
    # define_methodを使ってメソッドを動的に定義する
    define_method(name) do |target|
      puts "#{prefix}, #{target}!"
    end
  end
end

greeter = DynamicGreeter.new

# 動的に定義されたメソッドを呼び出す
greeter.hello("World")
greeter.goodbye("Alice")
greeter.hi("Bob")
```

```ruby-exec:dynamic_greeter.rb
Hello, World!
Goodbye, Alice!
Hi, Bob!
```
