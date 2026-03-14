---
id: ruby-blocks-arg
title: ブロック引数
level: 3
question:
  - '|name| の name はどこから来る引数で、どのように決められているのですか？'
  - ブロック引数は必ず1つだけなのですか？複数受け取ることはできますか？
  - '#{name} の記法は何を意味しますか？'
---

### ブロック引数

ブロックは `| ... |` を使って引数を受け取ることができます。

```ruby-repl
irb(main):018:0> ["Alice", "Bob"].each do |name|
irb(main):019:1* puts "Hello, #{name}!"
irb(main):020:1> end
Hello, Alice!
Hello, Bob!
=> ["Alice", "Bob"]
```
