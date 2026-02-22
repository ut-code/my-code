---
id: python-collections-5-comprehensions
title: 内包表記 (Comprehensions)による効率的な生成
level: 2
---

## 内包表記 (Comprehensions)による効率的な生成

内包表記は、既存のイテラブルから新しいリスト、辞書、セットを簡潔かつ効率的に生成するためのPythonらしい構文です。`for`ループを使うよりも短く、可読性が高いコードを書くことができます。

**リスト内包表記**

`for`ループで書く場合と、リスト内包表記で書く場合を比較してみましょう。

```python-repl:6
>>> # forループの場合
>>> squares_loop = []
>>> for i in range(10):
...     squares_loop.append(i * i)
...
>>> squares_loop
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

>>> # リスト内包表記の場合 (簡潔！)
>>> squares_comp = [i * i for i in range(10)]
>>> squares_comp
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

>>> # 条件付きも可能 (偶数のみ2乗)
>>> even_squares = [i * i for i in range(10) if i % 2 == 0]
>>> even_squares
[0, 4, 16, 36, 64]
```

**辞書内包表記**

```python-repl:7
>>> # 数値をキー、その2乗を値とする辞書を作成
>>> square_dict = {x: x*x for x in range(5)}
>>> square_dict
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

**セット内包表記**

```python-repl:8
>>> # リスト内のユニークな数値の2乗のセットを作成
>>> numbers = [1, 2, 2, 3, 4, 4, 5]
>>> square_set = {x*x for x in numbers}
>>> square_set
{1, 4, 9, 16, 25}
```
