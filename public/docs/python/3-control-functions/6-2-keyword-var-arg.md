---
id: python-control-functions-keyword-var-arg
title: '**kwargs'
level: 3
question:
  - '`**user_info`の`**`は何を意味していますか？'
  - '`**kwargs`で受け取った引数が辞書になるのはなぜですか？'
  - '`Any`の代わりに特定の型を指定することはできますか？'
---

### `**kwargs`

任意の数の**キーワード引数**を辞書として受け取ります。型アノテーションでは `**kwargs: 型` のように表現します。どのような型の値も受け付ける場合は `Any` を使います。

```python-repl
>>> from typing import Any
>>> def print_profile(**user_info: Any) -> None:
...     print(f"受け取った辞書: {user_info}")
...     for key, value in user_info.items():
...         print(f"{key}: {value}")
...
>>> print_profile(name="Sato", age=28, city="Tokyo")
受け取った辞書: {'name': 'Sato', 'age': 28, 'city': 'Tokyo'}
name: Sato
age: 28
city: Tokyo
```
