---
id: ruby-testing-10-assert-raisesexcepti
title: 'assert_raises(Exception) { ... }'
level: 3
---

### `assert_raises(Exception) { ... }`

ブロック `{ ... }` を実行した結果、指定した例外（`Exception`）が発生することを検証します。

これは、意図したエラー処理が正しく動作するかをテストするのに非常に重要です。

```ruby:test_calculator_errors.rb
require 'minitest/autorun'

class Calculator
  def divide(a, b)
    raise ZeroDivisionError, "Cannot divide by zero" if b == 0
    a / b
  end
end

class CalculatorErrorTest < Minitest::Test
  def test_division_by_zero
    calc = Calculator.new

    # ブロック内で ZeroDivisionError が発生することを期待する
    assert_raises(ZeroDivisionError) do
      calc.divide(10, 0)
    end
  end
end
```

```ruby-exec:test_calculator_errors.rb
Run options: --seed 19800

# Running:

.

Finished in 0.000624s, 1602.5641 runs/s, 1602.5641 assertions/s.

1 runs, 1 assertions, 0 failures, 0 errors, 0 skips
```
