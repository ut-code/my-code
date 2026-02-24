---
id: python-exceptions-tuple-except
title: 2. 1つの except ブロックでタプルを使ってまとめる
level: 3
---

### 2\. 1つの `except` ブロックでタプルを使ってまとめる

複数の例外に対して同じ処理を行いたい場合に便利です。

```python:tuple-except.py
def calculate_v2(a, b):
  try:
    a = int(a)
    b = int(b)
    result = a / b
    print(f"計算結果: {result}")
  except (ValueError, ZeroDivisionError) as e:
    print(f"入力エラーが発生しました: {e}")

calculate_v2(20, 0)
calculate_v2('twenty', 5)
```
```python-exec:tuple-except.py
入力エラーが発生しました: division by zero
入力エラーが発生しました: invalid literal for int() with base 10: 'twenty'
```

`as e` のように書くことで、発生した例外オブジェクトそのものを変数 `e` で受け取ることができます。これにより、具体的なエラーメッセージを表示できます。
