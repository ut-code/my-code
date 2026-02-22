---
id: ruby-control-methods-14-begin-rescue-ensure
title: begin, rescue, ensure
level: 3
---

### begin, rescue, ensure

  * `begin`: 例外が発生する可能性のある処理を囲みます。
  * `rescue`: 例外を捕捉（catch）します。捕捉する例外クラスを指定できます。
  * `else`: (Optional) `begin` ブロックで例外が発生しなかった場合に実行されます。
  * `ensure`: (Optional) 例外の有無にかかわらず、最後に必ず実行されます（finally）。

```ruby:exception_example.rb
def safe_divide(a, b)
  begin
    # メインの処理
    result = a / b
  rescue ZeroDivisionError => e
    # ゼロ除算エラーを捕捉
    puts "Error: ゼロで割ることはできません。"
    puts "(#{e.class}: #{e.message})"
    result = nil
  rescue TypeError => e
    # 型エラーを捕捉
    puts "Error: 数値以外が使われました。"
    puts "(#{e.class}: #{e.message})"
    result = nil
  else
    # 例外が発生しなかった場合
    puts "計算成功: #{result}"
  ensure
    # 常に実行
    puts "--- 処理終了 ---"
  end
  
  return result
end

safe_divide(10, 2)
safe_divide(10, 0)
safe_divide(10, "a")
```

```ruby-exec:exception_example.rb
計算成功: 5
--- 処理終了 ---
Error: ゼロで割ることはできません。
(ZeroDivisionError: divided by 0)
--- 処理終了 ---
Error: 数値以外が使われました。
(TypeError: String can't be coerced into Integer)
--- 処理終了 ---
```

> **補足:** `def` ... `end` のメソッド定義内では、`begin` と `end` は省略可能です。
