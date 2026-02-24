---
id: ruby-collections-hash-rocket
title: '1. 旧シンタックス (Rocket Syntax)'
level: 3
---

### 1\. 旧シンタックス (Rocket Syntax)

`=>`（ハッシュロケット）を使う記法です。キーには**任意のオブジェクト**（文字列、数値、シンボルなど）を使用できます。

```ruby-repl
irb(main):001:0> # キーが文字列の場合
irb(main):002:0> user_profile = { "name" => "Alice", "age" => 30 }
=> {"name"=>"Alice", "age"=>30}
irb(main):003:0> user_profile["name"]
=> "Alice"
```
