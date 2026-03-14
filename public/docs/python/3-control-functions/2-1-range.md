---
id: python-control-functions-range
title: range() 関数
level: 3
question:
  - '`range(5)`はなぜ0から4までの数値を生成するのですか？'
  - '`range()`関数で1から5までの数値を生成するにはどうすればいいですか？'
  - '`range()`関数で2つ飛ばしや逆順の数値を生成できますか？'
---

### `range()` 関数

決まった回数のループを実行したい場合は、`range()`関数が便利です。`range(n)`は0からn-1までの連続した数値を生成します。

```python-repl
>>> for i in range(5):
...     print(i)
...
0
1
2
3
4
```
