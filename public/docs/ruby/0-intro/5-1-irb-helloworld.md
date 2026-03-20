---
id: ruby-intro-irb-helloworld
title: irbでの実行
level: 3
question:
  - '`puts`は具体的にどのような場面で使うメソッドですか？'
  - '`puts "Hello, World!"` の返り値が `nil` なのはなぜですか？'
---

### irbでの実行

`puts`（"put string"）は、引数を標準出力（ターミナル）に出力し、最後に改行を追加するメソッドです。

```ruby-repl
irb(main):001> puts "Hello, World!"
Hello, World!
=> nil
```

（`puts`メソッド自体の返り値は、常に`nil`です。）
