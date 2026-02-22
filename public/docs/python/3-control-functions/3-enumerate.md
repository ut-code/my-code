---
id: python-control-functions-3-enumerate
title: enumerate() 関数
level: 3
---

### `enumerate()` 関数

ループ処理の中で、要素のインデックス（番号）と値の両方を使いたい場合があります。そのような時は`enumerate()`関数を使うと、コードが非常にスッキリします。これは非常にPythonらしい書き方の一つです。

```python-repl:5
>>> fruits = ['apple', 'banana', 'cherry']
>>> for i, fruit in enumerate(fruits):
...     print(f"Index: {i}, Value: {fruit}")
...
Index: 0, Value: apple
Index: 1, Value: banana
Index: 2, Value: cherry
```
