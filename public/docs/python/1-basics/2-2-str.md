---
id: python-basics-str
title: 文字列（str）
level: 3
question:
  - シングルクォートとダブルクォートで文字列を囲むことの違いは何ですか？
  - 文字列の中にクォート文字自身を含めたい場合はどうすれば良いですか？
  - 文字列の連結や繰り返し以外に、よく使う文字列操作の機能はありますか？
  - 空の文字列はどのように表現しますか？
---

### 文字列（str）

文字列はシングルクォート (`'`) またはダブルクォート (`"`) で囲んで作成します。

文字列の連結は `+` 演算子、繰り返しは `*` 演算子を使います。

```python-repl
>>> name = "Guido"
>>> greeting = 'Hello'
>>> full_greeting = greeting + ", " + name + "!"
>>> print(full_greeting)
Hello, Guido!
>>> print("-" * 10)
----------
```

