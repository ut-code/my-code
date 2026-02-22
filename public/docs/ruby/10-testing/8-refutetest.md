---
id: ruby-testing-8-refutetest
title: refute(test)
level: 3
---

### `refute(test)`

`assert` の逆です。`test` が **false** または `nil` であることを検証します。

```ruby-repl
irb> refute [1, 2, 3].empty?
=> true
irb> refute "hello".include?("e")
# Minitest::Assertion: Expected "hello".include?("e") to be falsy.
```
