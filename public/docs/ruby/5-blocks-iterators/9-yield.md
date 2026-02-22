---
id: ruby-blocks-iterators-9-yield
title: yield：ブロックを受け取るメソッド
level: 2
---

## yield：ブロックを受け取るメソッド

では、どうすればブロックを受け取るメソッドを自分で作れるのでしょうか？
それには `yield` というキーワードを使います。

メソッド内で `yield` が呼び出されると、そのメソッドに渡されたブロックが実行されます。

```ruby:yield_basic.rb
def simple_call
  puts "メソッド開始"
  yield # ここでブロックが実行される
  puts "メソッド終了"
end

simple_call do
  puts "ブロック内の処理です"
end
```

```ruby-exec:yield_basic.rb
メソッド開始
ブロック内の処理です
メソッド終了
```

`yield` はブロックに引数を渡すこともできます。

```ruby:yield_with_args.rb
def call_with_name(name)
  puts "メソッド開始"
  yield(name) # ブロックに "Alice" を渡す
  yield("Bob") # ブロックに "Bob" を渡す
  puts "メソッド終了"
end

call_with_name("Alice") do |n|
  puts "ブロックが #{n} を受け取りました"
end
```

```ruby-exec:yield_with_args.rb
メソッド開始
ブロックが Alice を受け取りました
ブロックが Bob を受け取りました
メソッド終了
```

`each` や `map` のようなイテレータは、内部でこの `yield` を使って、コレクションの各要素をブロックに渡しながら実行しているのです。
