---
id: python-control-functions-10-lambda-expressions
title: ラムダ式（Lambda expressions）
level: 2
---

## ラムダ式（Lambda expressions）

`lambda`キーワードを使うと、名前のない小さな**無名関数**を定義できます。

構文: `lambda 引数: 式`

```python-repl:12
>>> # 通常の関数で2つの数を足す
>>> def add(x: int, y: int) -> int:
...     return x + y
...
>>> # ラムダ式で同じ処理を定義
>>> add_lambda = lambda x, y: x + y
>>> print(add_lambda(3, 5))
8
>>> # sorted関数のキーとして利用する例
>>> students = [('Taro', 80), ('Jiro', 95), ('Saburo', 75)]
>>> # 成績（タプルの2番目の要素）でソートする
>>> sorted_students = sorted(students, key=lambda student: student[1], reverse=True)
>>> print(sorted_students)
[('Jiro', 95), ('Taro', 80), ('Saburo', 75)]
```
