---
id: ruby-control-methods-2-unless
title: unless
level: 3
---

### unless

`unless`は `if !`（もし～でなければ）の糖衣構文（Syntactic Sugar）です。条件が**偽 (false)** の場合にブロックが実行されます。

```ruby-repl:2
irb(main):010:0> logged_in = false
=> false
irb(main):011:0> unless logged_in
irb(main):012:1* puts "ログインしてください"
irb(main):013:1* end
ログインしてください
=> nil
```

> **補足:** `unless` に `else` を付けることも可能ですが、多くの場合 `if` を使った方が可読性が高くなります。
