---
id: ruby-basics-1-ruby
title: 🔢 Rubyの基本データ型
level: 2
---

## 🔢 Rubyの基本データ型

Rubyには多くの組み込みデータ型がありますが、まずは基本的なものを押さえましょう。

  * **Integer (整数)**: `1`, `100`, `-5`, `1_000_000` ( `_` は読みやすさのためのもので、無視されます)
  * **Float (浮動小数点数)**: `1.5`, `3.14`, `-0.001`
  * **String (文字列)**: `"Hello"`, `'World'`
  * **Boolean (真偽値)**: `true`, `false`
  * **NilClass (nil)**: `nil` (何も存在しないことを示す唯一の値)
  * **Array (配列)**: `[1, "apple", true]`
  * **Hash (ハッシュ)**: `{"key1" => "value1", :key2 => "value2"}`
  * **Symbol (シンボル)**: `:my_symbol` (後述します)

Rubyでは、これらすべてが「オブジェクト」であり、メソッドを持っています。

```ruby-repl:2
irb(main):001> 100.class
=> Integer
irb(main):002> "Hello".class
=> String
irb(main):003> 3.14.class
=> Float
irb(main):004> true.class
=> TrueClass
irb(main):005> nil.class
=> NilClass
irb(main):006> [1, 2].class
=> Array
irb(main):007> {a: 1}.class
=> Hash
irb(main):008> :symbol.class
=> Symbol
```
