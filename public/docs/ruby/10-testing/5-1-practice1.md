---
id: ruby-testing-practice1
title: '練習問題1: Stringクラスのテスト'
level: 3
question:
  - この練習問題でStringクラスをテストする際、`require_relative` は不要なのはなぜですか？
  - 組み込みクラスの動作をテストすることに、どのような意味がありますか？
---

### 練習問題1: Stringクラスのテスト

`Minitest::Test` を使って、Rubyの組み込みクラスである `String` の動作をテストする `test_string.rb` を作成してください。以下の2つのテストメソッドを実装してください。

  * `test_string_length`: `"hello"` の `length` が `5` であることを `assert_equal` で検証してください。
  * `test_string_uppercase`: `"world"` を `upcase` した結果が `"WORLD"` であることを `assert_equal` で検証してください。

```ruby:test_string.rb
require 'minitest/autorun'


```

```ruby-exec:test_string.rb
```
