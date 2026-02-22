---
id: python-control-functions-8-args
title: '*args'
level: 3
---

### `*args`

任意の数の**位置引数**をタプルとして受け取ります。型アノテーションでは `*args: 型` のように表現します。

```python-repl:10
>>> def sum_all(*numbers: int) -> int:
...     print(f"受け取ったタプル: {numbers}")
...     total = 0
...     for num in numbers:
...         total += num
...     return total
...
>>> print(sum_all(1, 2, 3))
受け取ったタプル: (1, 2, 3)
6
>>> print(sum_all(10, 20, 30, 40, 50))
受け取ったタプル: (10, 20, 30, 40, 50)
150
```
