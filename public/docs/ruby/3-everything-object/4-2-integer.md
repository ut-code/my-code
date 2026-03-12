---
id: ruby-everything-object-integer
title: Integer / Float (数値)
level: 3
question:
  - Numericクラスとは何ですか？IntegerとFloatはそれに含まれるということですか？
  - .even?や.odd?のようなメソッドは他にどんなものがありますか？
  - .to_s、.to_f、.to_iはどのような時に使いますか？
  - 10.5.roundが11になるのは、四捨五入の結果ですか？
  - Floatで小数点以下の桁数を指定して丸める方法はありますか？
---

### Integer / Float (数値)

数値クラス (総称して `Numeric`) も便利なメソッドを持っています。

```ruby-repl
irb(main):001:0> # Integer
irb(main):002:0> 10.even?
=> true
irb(main):003:0> 10.odd?
=> false
irb(main):004:0> 5.to_s
=> "5"
irb(main):005:0> 5.to_f
=> 5.0

irb(main):006:0> # Float
irb(main):007:0> 10.5.round
=> 11
irb(main):008:0> 10.5.floor # 切り捨て
=> 10
irb(main):009:0> 10.5.ceil # 切り上げ
=> 11
irb(main):010:0> (10.5).to_i
=> 10
```
