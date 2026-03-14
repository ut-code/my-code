---
id: ruby-exception-raise
title: raise (例外の発生)
level: 3
question:
  - raiseを使って例外を発生させた後、プログラムの実行はどうなりますか？
  - 自分で新しい例外クラスを定義してraiseすることはできますか？
  - エラーメッセージに含めるべき情報はどのようなものがありますか？
---

### `raise` (例外の発生)

`raise` を使って、意図的に例外を発生（throw）させることができます。

```ruby-repl
irb(main):001:0> def check_age(age)
irb(main):002:1* if age < 0
irb(main):003:2* # raise "エラーメッセージ"
irb(main):004:2* # raise 例外クラス, "エラーメッセージ"
irb(main):005:2* raise ArgumentError, "年齢は負の値にできません"
irb(main):006:2* end
irb(main):007:1* puts "年齢は #{age} 歳です"
irb(main):008:1* end
=> :check_age
irb(main):009:0> check_age(20)
年齢は 20 歳です
=> nil
irb(main):010:0> check_age(-5)
(irb):5:in `check_age': 年齢は負の値にできません (ArgumentError)
    from (irb):10:in `<main>'
    ...
```
