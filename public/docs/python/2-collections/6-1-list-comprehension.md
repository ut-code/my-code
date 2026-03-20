---
id: python-collections-list-comprehension
title: リスト内包表記
level: 3
question:
  - リスト内包表記で複数の`if`条件を組み合わせることはできますか？
  - リスト内包表記でネストした`for`ループを書くことは可能ですか？
---

### リスト内包表記

`for`ループで書く場合と、リスト内包表記で書く場合を比較してみましょう。

```python-repl
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
