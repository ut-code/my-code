---
id: ruby-control-methods-6-until
title: until
level: 3
---

### until

`while !` と同じです。条件が**偽 (false)** の間、ループを続けます。

```ruby-repl:4
irb(main):006:0> counter = 5
=> 5
irb(main):007:0> until counter == 0
irb(main):008:1* print counter, " "
irb(main):009:1* counter -= 1
irb(main):010:1* end
5 4 3 2 1 => nil
```
