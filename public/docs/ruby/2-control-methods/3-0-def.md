---
id: ruby-methods-def
title: メソッドの定義 (def)
level: 2
---

## メソッドの定義 (`def`)

Rubyでは、`def` キーワードを使ってメソッドを定義します。

Rubyのメソッドは、**最後に評価された式の結果**を暗黙的に返します。`return` キーワードは、メソッドの途中で明示的に値を返したい場合（早期リターン）に使いますが、必須ではありません。

```ruby:method_return.rb
# 最後に評価された a + b が自動的に戻り値となる
def add(a, b)
  a + b
end

# 早期リターンで return を使う例
def check_value(val)
  if val < 0
    return "Negative" # ここで処理が中断
  end

  # val >= 0 の場合は、この式が評価され、戻り値となる
  "Positive or Zero"
end

puts add(10, 5)
puts check_value(-10)
puts check_value(10)
```

```ruby-exec:method_return.rb
15
Negative
Positive or Zero
```
