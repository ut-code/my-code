---
id: ruby-metaprogramming-1-send
title: 'send: メソッドを動的に呼び出す'
level: 2
---

## send: メソッドを動的に呼び出す

通常、メソッドは `object.method_name` のようにドット（`.`）を使って呼び出します。しかし、呼び出したいメソッド名が実行時までわからない場合、`send` メソッド（または `public_send`）が役立ちます。

`send` は、第1引数にメソッド名を**シンボル**（`:`）または**文字列**で受け取り、残りの引数をそのメソッドに渡して実行します。

```ruby-repl
irb(main):001> "hello".send(:upcase)
=> "HELLO"
irb(main):002> "hello".send("length")
=> 5
irb(main):003> 10.send(:+, 5) # 演算子も内部的にはメソッドです
=> 15
irb(main):004> 
irb(main):004> method_to_call = :reverse
irb(main):005> "Ruby".send(method_to_call)
=> "ybuR"
```

> **注意**: `send` は `private` メソッドも呼び出すことができます。意図せず `private` メソッドを呼び出さないように、通常は `public_send` を使う方が安全です。
