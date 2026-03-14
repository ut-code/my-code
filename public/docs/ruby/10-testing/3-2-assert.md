---
id: ruby-testing-assert
title: assert(test)
level: 3
question:
  - '`assert(test)` の `test` が `true` と評価される値とは、具体的にどのようなものがありますか？'
  - '`assert` と `assert_equal(true, test)` は同じ意味ですか？使い分ける基準はありますか？'
---

### `assert(test)`

`test` が **true**（またはtrueと評価される値）であることを検証します。偽（`false` または `nil`）の場合は失敗します。

```ruby-repl
irb> assert "hello".include?("e")
=> true
irb> assert [1, 2, 3].empty?
# Minitest::Assertion: Expected [] to be empty?.
```
