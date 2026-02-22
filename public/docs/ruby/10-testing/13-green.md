---
id: ruby-testing-13-green
title: '2. Green: テストを通す最小限のコードを書く'
level: 3
---

### 2\. Green: テストを通す最小限のコードを書く

次に、`calculator.rb` に以下のように `multiply` メソッドを実装し、テストをパス（Green）させます。

```ruby
class Calculator
  def add(a, b)
    a + b
  end

  def subtract(a, b)
    a - b
  end

  # 2. Green: テストを通す最小限の実装
  def multiply(a, b)
    a * b
  end
end
```

`calculator.rb` を編集し、再びテストを実行すると、以下のようにすべてのテストが成功します。「Green」の状態です。

```bash
$ ruby test_calculator_tdd.rb
...
Finished in ...
3 runs, 3 assertions, 0 failures, 0 errors, 0 skips
```
