---
id: ruby-stdlib-time-date
title: 日付と時刻 (Time, Date)
level: 2
question:
  - TimeとDateのどちらを使うべきか、どのように判断すればよいですか？
  - Time.nowの出力にある+0900 (JST)は何を意味しますか？
  - UNIXタイムスタンプとは何ですか？
  - strftimeの%Y-%m-%dのような記号の意味はどこで確認できますか？
  - require 'date'が必要なのはなぜですか？
  - >-
    Dateオブジェクトの出力が#<Date: 2025-11-04
    ((2461014j,0s,0n),+0s,2299161j)>のようになるのはなぜですか？
  - 日付の引き算でto_iを使うと日数になるのはなぜですか？
---

## 日付と時刻 (`Time`, `Date`)

Rubyには `Time`（組み込み）と `Date`（要 `require`）の2つの主要な日時クラスがあります。

  * **Time:** 時刻（タイムスタンプ）をナノ秒までの精度で扱います。
  * **Date:** 日付（年月日）のみを扱い、カレンダー計算に特化しています。

```ruby-repl
irb(main):001:0> # Time (組み込み)
irb(main):002:0> now = Time.now
=> 2025-11-04 11:32:00 +0900 (JST)
irb(main):003:0> now.year
=> 2025
irb(main):004:0> now.monday?
=> false
irb(main):005:0> now.to_i # UNIXタイムスタンプ
=> 1762309920

irb(main):006:0> # strftime (string format time) でフォーマット
irb(main):007:0> now.strftime("%Y-%m-%d %H:%M:%S")
=> "2025-11-04 11:32:00"

irb(main):008:0> # Date (require が必要)
irb(main):009:0> require 'date'
=> true
irb(main):010:0> today = Date.today
=> #<Date: 2025-11-04 ((2461014j,0s,0n),+0s,2299161j)>
irb(main):011:0> today.strftime("%A") # 曜日
=> "Tuesday"

irb(main):012:0> # 文字列からのパース
irb(main):013:0> christmas = Date.parse("2025-12-25")
=> #<Date: 2025-12-25 ((2461065j,0s,0n),+0s,2299161j)>
irb(main):014:0> (christmas - today).to_i # あと何日？
=> 51
```
