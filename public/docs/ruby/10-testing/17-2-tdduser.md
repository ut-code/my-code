---
id: ruby-testing-17-2-tdduser
title: '練習問題2: TDDでUserクラスを実装'
level: 3
---

### 練習問題2: TDDでUserクラスを実装

TDDの「Red -\> Green」サイクルを体験してください。

1.  （Red）`User` クラスに `first_name` と `last_name` を渡してインスタンス化し、`full_name` メソッドを呼ぶと `"First Last"` のように連結された文字列が返ることを期待するテスト `test_full_name` を含む `test_user.rb` を先に作成してください。（この時点では `user.rb` は空か、存在しなくても構いません）
2.  （Green）テストがパスするように、`user.rb` に `User` クラスを実装してください。（`initialize` で名前を受け取り、`full_name` メソッドで連結します）


```ruby:user.rb
```

```ruby:test_user.rb
require 'minitest/autorun'
require_relative 'user'

```

```ruby-exec:test_user.rb
```
