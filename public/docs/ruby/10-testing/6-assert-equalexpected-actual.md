---
id: ruby-testing-6-assert-equalexpected
title: assert_equal(expected, actual)
level: 3
---

### `assert_equal(expected, actual)`

最もよく使うアサーションです。「期待値（expected）」と「実際の結果（actual）」が `==` で等しいことを検証します。

> **⚠️ 注意:** 引数の順序が重要です。\*\*1番目が「期待値」、2番目が「実際の結果」\*\*です。逆にすると、失敗時のメッセージが非常に分かりにくくなります。

```ruby-repl
irb> require 'minitest/assertions'
=> true
irb> include Minitest::Assertions
=> Object
irb> def assert_equal(expected, actual); super; end # irbで使うための設定
=> :assert_equal

irb> assert_equal 5, 2 + 3
=> true

irb> assert_equal 10, 2 + 3
# Minitest::Assertion:         <--- 失敗（Assertion Failed）
# Expected: 10
#   Actual: 5
```
