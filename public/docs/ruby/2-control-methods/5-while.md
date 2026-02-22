---
id: ruby-control-methods-5-while
title: while
level: 3
---

### while

条件が**真 (true)** の間、ループを続けます。

```ruby-repl:3
irb(main):001:0> i = 0
=> 0
irb(main):002:0> while i < 3
irb(main):003:1* print i, " " # printは改行しません
irb(main):004:1* i += 1 # Rubyに i++ はありません
irb(main):005:1* end
0 1 2 => nil
```
