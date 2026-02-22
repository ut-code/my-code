---
id: python-control-functions-4-while
title: whileループ
level: 2
---

## whileループ

`while`ループは、指定された条件が`True`である間、処理を繰り返します。ループを途中で抜けたい場合は`break`を、現在の回の処理をスキップして次の回に進みたい場合は`continue`を使用します。

```python-repl:6
>>> n = 0
>>> while n < 5:
...     print(n)
...     n += 1
...
0
1
2
3
4
```
