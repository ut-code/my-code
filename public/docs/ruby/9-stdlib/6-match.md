---
id: ruby-stdlib-6-match
title: マッチの確認 (=~ と match)
level: 3
---

### マッチの確認 (`=~` と `match`)

  * `=~` 演算子: マッチした位置のインデックス（0から始まる）を返すか、マッチしなければ `nil` を返します。
  * `String#match`: `MatchData` オブジェクトを返すか、マッチしなければ `nil` を返します。`MatchData` は、キャプチャグループ（`()`で囲んだ部分）へのアクセスに便利です。

```ruby-repl:4
irb(main):001:0> text = "User: alice@example.com (Alice Smith)"
=> "User: alice@example.com (Alice Smith)"

irb(main):002:0> # =~ は位置を返す
irb(main):003:0> text =~ /alice/
=> 6
irb(main):004:0> text =~ /bob/
=> nil

irb(main):005:0> # String#match は MatchData を返す
irb(main):006:0> # パターン: (ユーザー名)@(ドメイン)
irb(main):007:0> match_data = text.match(/(\w+)@([\w\.]+)/)
=> #<MatchData "alice@example.com" 1:"alice" 2:"example.com">

irb(main):008:0> # マッチしたオブジェクトからキャプチャを取得
irb(main):009:0> match_data[0] # マッチ全体
=> "alice@example.com"
irb(main):010:0> match_data[1] # 1番目の ()
=> "alice"
irb(main):011:0> match_data[2] # 2番目の ()
=> "example.com"
```
