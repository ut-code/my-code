---
id: ruby-testing-assert_nil
title: assert_nil(obj)
level: 3
question:
  - '`assert_nil` で `nil` 以外の値を検証しようとすると、どうなりますか？'
---

### `assert_nil(obj)`

`obj` が `nil` であることを検証します。

```ruby-repl
irb> a = nil
=> nil
irb> assert_nil a
=> true
```
