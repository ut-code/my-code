---
id: ruby-blocks-iterators-0-doend
title: 'ブロック構文： do...end と {}'
level: 2
---

## ブロック構文： do...end と {}

ブロックとは、メソッド呼び出しに渡すことができる**コードの塊**です。メソッド側は、受け取ったそのコードの塊を好きなタイミングで実行できます。

ブロックには2種類の書き方があります。

1.  **`{ ... }` (波括弧)**: 通常、1行で完結する場合に使われます。
2.  **`do ... end`**: 複数行にわたる処理を書く場合に使われます。

どちらも機能的にはほぼ同じです。最も簡単な例は、指定した回数だけブロックを実行する `times` メソッドです。

```ruby-repl:1
irb(main):001:0> 3.times { puts "Hello!" }
Hello!
Hello!
Hello!
=> 3

irb(main):002:0> 3.times do
irb(main):003:1* puts "Ruby is fun!"
irb(main):004:1> end
Ruby is fun!
Ruby is fun!
Ruby is fun!
=> 3
```

`3.times` というメソッド呼び出しの後ろに `{ ... }` や `do ... end` で囲まれたコードブロックを渡しています。`times` メソッドは、そのブロックを3回実行します。
