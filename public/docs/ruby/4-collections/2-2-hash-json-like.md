---
id: ruby-collections-hash-json-like
title: 2. 新シンタックス (JSON-like Syntax)
level: 3
question:
  - シンボルとは具体的に何ですか？なぜキーに使うと好まれるのですか？
  - 新シンタックスで、キーを意図的に文字列にすることはできますか？
  - 新シンタックスと旧シンタックスのどちらを使うべきか迷った場合の基準は何ですか？
  - 新シンタックスで作成したハッシュに、文字列キーでアクセスしようとするとどうなりますか？
---

#### 2\. 新シンタックス (JSON-like Syntax)

Ruby 1.9から導入された、より簡潔な記法です。JavaScriptのオブジェクトリテラルに似ています。

> **注意:** この記法を使うと、**キーは自動的にシンボル (Symbol) になります**。

```ruby-repl
irb(main):004:0> # 新シンタックス (キーはシンボルになる)
irb(main):005:0> user_profile_new = { name: "Bob", age: 25 }
=> {:name=>"Bob", :age=>25}
irb(main):006:0> # アクセス時もシンボル (:name) を使う
irb(main):007:0> user_profile_new[:name]
=> "Bob"
```

現在では、キーが固定されている場合は、シンボルを使った新シンタックスが好まれます。
