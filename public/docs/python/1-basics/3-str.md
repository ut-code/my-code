---
id: python-basics-3-str
title: 文字列（str）
level: 3
---

### 文字列（str）

文字列はシングルクォート (`'`) またはダブルクォート (`"`) で囲んで作成します。

```python-repl:5
>>> name = "Guido"
>>> greeting = 'Hello'
```

文字列の連結は `+` 演算子、繰り返しは `*` 演算子を使います。

```python-repl:6
>>> full_greeting = greeting + ", " + name + "!"
>>> print(full_greeting)
Hello, Guido!
>>> print("-" * 10)
----------
```

変数の値を文字列に埋め込む際には、**f-string (フォーマット済み文字列リテラル)** が非常に便利で推奨されています。文字列の前に `f` を付け、埋め込みたい変数を `{}` で囲みます。

```python-repl:7
>>> name = "Ada"
>>> age = 36
>>> message = f"My name is {name} and I am {age} years old."
>>> print(message)
My name is Ada and I am 36 years old.
```
