---
id: ruby-testing-refute
title: refute(test)
level: 3
question:
  - '`refute` と `assert_equal(false, test)` は同じ意味ですか？どちらを使えば良いですか？'
---

### `refute(test)`

`assert` の逆です。`test` が **false** または `nil` であることを検証します。

```ruby-repl
irb> refute [1, 2, 3].empty?
=> true
irb> refute "hello".include?("e")
# Minitest::Assertion: Expected "hello".include?("e") to be falsy.
```
