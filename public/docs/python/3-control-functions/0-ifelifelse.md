---
id: python-control-functions-0-ifelifelse
title: if/elif/elseによる条件分岐
level: 2
---

## if/elif/elseによる条件分岐

Pythonの条件分岐は`if`、`elif`（else ifの略）、`else`を使って記述します。C言語やJavaのような波括弧`{}`は使わず、**コロン`:`とインデント（通常は半角スペース4つ）**でコードブロックを表現するのが最大の特徴です。

```python-repl:1
>>> score = 85
>>> if score >= 90:
...     print('優')
... elif score >= 80:
...     print('良')
... elif score >= 70:
...     print('可')
... else:
...     print('不可')
...
良
```

条件式に`and`や`or`、`not`といった論理演算子も使用できます。

```python-repl:2
>>> temp = 25
>>> is_sunny = True
>>> if temp > 20 and is_sunny:
...     print("お出かけ日和です")
...
お出かけ日和です
```
