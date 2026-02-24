---
id: python-basics-f-string
title: f-string (フォーマット済み文字列リテラル)
level: 4
---

#### f-string (フォーマット済み文字列リテラル)
変数の値を文字列に埋め込む際には、**f-string** が非常に便利で推奨されています。文字列の前に `f` を付け、埋め込みたい変数を `{}` で囲みます。

```python-repl
>>> name = "Ada"
>>> age = 36
>>> message = f"My name is {name} and I am {age} years old."
>>> print(message)
My name is Ada and I am 36 years old.
```
