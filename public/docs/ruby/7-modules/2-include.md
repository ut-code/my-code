---
id: ruby-modules-2-include
title: ミックスインとしてのモジュール (include)
level: 2
---

## ミックスインとしてのモジュール (include)

モジュールの最も強力な機能がミックスインです。これにより、クラスは継承ツリーとは無関係に、モジュールの振る舞い（インスタンスメソッド）を取り込むことができます。

`include` を使うと、モジュールはクラスの継承チェーン（祖先チェーン）に挿入されます。具体的には、`include` したクラスのスーパークラスの「直前」に挿入されます。

```ruby:mix_in_example.rb
# 「飛ぶ」能力を提供するモジュール
module Flyable
  def fly
    puts "I'm flying! My speed is #{fly_speed}."
  end

  # このモジュールは、include したクラスが 
  # `fly_speed` メソッドを実装していることを期待している
end

# 「泳ぐ」能力を提供するモジュール
module Swimmable
  def swim
    puts "I'm swimming!"
  end
end

class Bird
  # fly_speed を実装
  def fly_speed
    "10km/h"
  end
end

class Duck < Bird
  include Flyable   # 飛べる
  include Swimmable # 泳げる
end

class Penguin < Bird
  include Swimmable # 泳げる (飛べない)
end

class Airplane
  include Flyable   # 飛べる (生物ではない)

  def fly_speed
    "800km/h"
  end
end

puts "--- Duck ---"
duck = Duck.new
duck.fly
duck.swim

puts "--- Penguin ---"
penguin = Penguin.new
# penguin.fly #=> NoMethodError
penguin.swim

puts "--- Airplane ---"
airplane = Airplane.new
airplane.fly
# airplane.swim #=> NoMethodError
```

```ruby-exec:mix_in_example.rb
--- Duck ---
I'm flying! My speed is 10km/h.
I'm swimming!
--- Penguin ---
I'm swimming!
--- Airplane ---
I'm flying! My speed is 800km/h.
```

`Duck` と `Airplane` は全く異なるクラス（`Bird` のサブクラスと、`Object` のサブクラス）ですが、`Flyable` モジュールを `include` することで `fly` メソッドを共有できています。
