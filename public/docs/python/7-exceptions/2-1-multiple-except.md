---
id: python-exceptions-multiple-except
title: 1. except ブロックを複数記述する
level: 3
question:
  - 複数の`except`ブロックを書く場合、エラーが発生したときにどの`except`が実行されるのですか？
  - 想定していない種類のエラーが発生したらどうなりますか？
  - '`calculate`関数のように、`int()`や`/`など複数の処理に対して`try...except`を書くのが一般的なのですか？'
---

### 1\. `except` ブロックを複数記述する

エラーの種類ごとに異なる処理を行いたい場合に適しています。

```python:multiple-except.py
def calculate(a, b):
  try:
    a = int(a)
    b = int(b)
    result = a / b
    print(f"計算結果: {result}")
  except ValueError:
    print("エラー: 数値を入力してください。")
  except ZeroDivisionError:
    print("エラー: 0で割ることはできません。")

calculate(10, 2)
calculate(10, 0)
calculate('ten', 2)
```
```python-exec:multiple-except.py
計算結果: 5.0
エラー: 0で割ることはできません。
エラー: 数値を入力してください。
```
