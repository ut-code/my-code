---
id: ruby-stdlib-json
title: JSONのパースと生成 (json)
level: 2
question:
  - require 'json'はなぜ必要なのですか？
  - JSONとは何ですか？なぜウェブ開発で不可欠なのですか？
  - JSON.parseはJSON文字列を常にHashに変換するのですか？Arrayの場合はどうなりますか？
  - RubyのHashのシンボルキーがJSONでは文字列になるのはなぜですか？
  - to_jsonメソッドはどんなRubyオブジェクトでもJSONに変換できますか？
  - JSON.pretty_generateは何のために使うのですか？
---

## JSONのパースと生成 (`json`)

現代のWeb開発においてJSONの扱いは不可欠です。`json` ライブラリは、JSON文字列とRubyのHash/Arrayを相互に変換する機能を提供します。

```ruby-repl
irb(main):001:0> require 'json'
=> true

irb(main):002:0> # 1. JSON文字列 -> Rubyオブジェクト (Hash) へのパース
irb(main):003:0> json_data = '{"user_id": 123, "name": "Alice", "tags": ["admin", "ruby"]}'
=> "{\"user_id\": 123, \"name\": \"Alice\", \"tags\": [\"admin\", \"ruby\"]}"

irb(main):004:0> parsed_data = JSON.parse(json_data)
=> {"user_id"=>123, "name"=>"Alice", "tags"=>["admin", "ruby"]}
irb(main):005:0> parsed_data['name']
=> "Alice"
irb(main):006:0> parsed_data['tags']
=> ["admin", "ruby"]

irb(main):007:0> # 2. Rubyオブジェクト (Hash) -> JSON文字列 への生成
irb(main):008:0> ruby_hash = {
irb(main):009:1* status: "ok",
irb(main):010:1* data: { item_id: 987, price: 1500 }
irb(main):011:1* }
=> {:status=>"ok", :data=>{:item_id=>987, :price=>1500}}

irb(main):012:0> # .to_json メソッドが便利です
irb(main):013:0> json_output = ruby_hash.to_json
=> "{\"status\":\"ok\",\"data\":{\"item_id\":987,\"price\":1500}}"

irb(main):014:0> # 人が読みやすいように整形 (pretty generate)
irb(main):015:0> puts JSON.pretty_generate(ruby_hash)
{
  "status": "ok",
  "data": {
    "item_id": 987,
    "price": 1500
  }
}
=> nil
```
