---
id: ruby-everything-object-1-nil
title: '👻 nil オブジェクト: 無ですらオブジェクト'
level: 2
---

## 👻 nil オブジェクト: 無ですらオブジェクト

Rubyには「何もない」「無効」な状態を示す `nil` という特別な値があります。これは他の言語における `null` や `None` に相当します。

しかし、Rubyの哲学を徹底している点は、この `nil` ですらオブジェクトであるということです。

```ruby-repl:4
irb(main):001:0> nil.class
=> NilClass
```

`nil` は `NilClass` という専用クラスの唯一のインスタンスです。オブジェクトであるため、`nil` もメソッドを持ちます。

```ruby-repl:5
irb(main):001:0> nil.nil?
=> true
irb(main):002:0> "hello".nil?
=> false
irb(main):003:0> nil.to_s
=> ""
irb(main):004:0> nil.to_i
=> 0
```

`nil` がメソッドを持つことで、`null` チェックに起因するエラー（例えば `null.someMethod()` のような呼び出しによるエラー）を避けやすくなり、より安全で流暢なコードが書ける場合があります。
