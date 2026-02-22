---
id: ruby-testing-12-red
title: '1. Red: 失敗するテストを書く'
level: 3
---

### 1\. Red: 失敗するテストを書く

まず、`test_calculator.rb` に `multiply` のテストを追加します。

```ruby:calculator.rb
# シンプルな電卓クラス
class Calculator
  def add(a, b)
    a + b
  end

  def subtract(a, b)
    a - b
  end
end
```

```ruby:test_calculator_tdd.rb
require 'minitest/autorun'
require_relative 'calculator' # calculator.rb は add と subtract のみ

class CalculatorTest < Minitest::Test
  def setup
    # @calc をインスタンス変数にすると、各テストメソッドで使える
    @calc = Calculator.new
  end

  def test_addition
    assert_equal(5, @calc.add(2, 3))
  end

  def test_subtraction
    assert_equal(1, @calc.subtract(4, 3))
  end
  
  # --- TDDサイクル スタート ---
  
  # 1. Red: まずテストを書く
  def test_multiplication
    assert_equal(12, @calc.multiply(3, 4))
  end
end
```

この時点で `calculator.rb` に `multiply` メソッドは存在しません。テストを実行します。

```ruby-exec:test_calculator_tdd.rb
# (実行結果の抜粋)
...
Error:
CalculatorTest#test_multiplication:
NoMethodError: undefined method `multiply' for #<Calculator:0x...>
...
1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
```

期待通り、`NoMethodError` でテストが**エラー (E)** になりました。これが「Red」の状態です。（Failure (F) はアサーションが期待と違った場合、Error (E) はコード実行中に例外が発生した場合を指します）
