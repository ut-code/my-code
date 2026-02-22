---
id: ruby-stdlib-7-scan-gsub
title: 検索と置換 (scan と gsub)
level: 3
---

### 検索と置換 (`scan` と `gsub`)

  * `String#scan`: マッチするすべての部分文字列を（キャプチャグループがあればその配列として）返します。
  * `String#gsub`: マッチするすべての部分を置換します (Global SUBstitute)。

```ruby-repl:5
irb(main):001:0> log = "ERROR: code 500. WARNING: code 404. ERROR: code 403."
=> "ERROR: code 500. WARNING: code 404. ERROR: code 403."

irb(main):002:0> # scan: 'ERROR: code (数字)' にマッチする部分をすべて探す
irb(main):003:0> log.scan(/ERROR: code (\d+)/)
=> [["500"], ["403"]]

irb(main):004:0> # gsub: 'ERROR' を 'CRITICAL' に置換する
irb(main):005:0> log.gsub("ERROR", "CRITICAL")
=> "CRITICAL: code 500. WARNING: code 404. CRITICAL: code 403."

irb(main):006:0> # gsub はブロックと正規表現を組み合わせて高度な置換が可能
irb(main):007:0> # 数字（コード）を [] で囲む
irb(main):008:0> log.gsub(/code (\d+)/) do |match|
irb(main):009:1* # $1 は最後のマッチの1番目のキャプチャグループ
irb(main):010:1* "code [#{$1}]"
irb(main):011:1> end
=> "ERROR: code [500]. WARNING: code [404]. ERROR: code [403]."
```
