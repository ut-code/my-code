---
id: ruby-testing-7-asserttest
title: assert(test)
level: 3
---

### `assert(test)`

`test` が **true**（またはtrueと評価される値）であることを検証します。偽（`false` または `nil`）の場合は失敗します。

```ruby-repl
irb> assert "hello".include?("e")
=> true
irb> assert [1, 2, 3].empty?
# Minitest::Assertion: Expected [] to be empty?.
```
