---
id: python-exceptions-2-raise
title: 独自例外の送出 (raise)
level: 2
---

## 独自例外の送出 (`raise`)

特定の条件を満たした場合に、意図的に例外を発生させたいことがあります。その場合は `raise` 文を使います。

例えば、負の値を受け付けない関数を考えてみましょう。

```python-repl:5
>>> def process_positive_number(num):
...   if num < 0:
...     raise ValueError("負の値は処理できません。")
...   print(f"{num}を処理しました。")
...
>>> process_positive_number(100)
100を処理しました。
>>> process_positive_number(-5)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in process_positive_number
ValueError: 負の値は処理できません。
```

このように、`raise` を使うことで、関数の事前条件などを満たさない場合に、プログラムの実行を中断して呼び出し元にエラーを通知できます。
