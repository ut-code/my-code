---
id: python-control-functions-5-def
title: 関数の定義 (def)
level: 2
---

## 関数の定義 (def)

関数は`def`キーワードを使って定義します。ここでもコードブロックはコロン`:`とインデントで示します。値は`return`キーワードで返します。

```python-repl:7
>>> def greet(name):
...     """指定された名前で挨拶を返す関数"""  # これはDocstringと呼ばれるドキュメント文字列です
...     return f"Hello, {name}!"
...
>>> message = greet("Alice")
>>> print(message)
Hello, Alice!
```

引数と返り値に**型アノテーション（型ヒント）**を付けることもできます。これはコードの可読性を高め、静的解析ツールによるバグの発見を助けますが、実行時の動作に直接影響を与えるものではありません。
型アノテーションは `引数名: 型` のように記述し、返り値の型は `-> 型:` のように記述します。

```python-repl:8
>>> # typingモジュールからList型をインポート
>>> from typing import List
>>> def greet(name: str) -> str:
...     """指定された名前で挨拶を返す関数"""
...     return f"Hello, {name}!"
...
>>> message = greet("Alice")
>>> print(message)
Hello, Alice!
```
