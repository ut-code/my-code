---
id: python-exceptions-0-tryexcept
title: try...exceptによる例外の捕捉
level: 2
---

## `try...except`による例外の捕捉

他の言語の `try...catch` と同様に、Pythonでは `try...except` ブロックを使います。エラーが発生する可能性のあるコードを `try` ブロックに記述し、エラーが発生した際の処理を `except` ブロックに記述します。

例えば、`0` で割り算をすると `ZeroDivisionError` という例外が発生します。

```python-repl:1
>>> 10 / 0
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ZeroDivisionError: division by zero
```

このエラーを `try...except` で捕捉してみましょう。

```python-repl:2
>>> try:
...   result = 10 / 0
... except ZeroDivisionError:
...   print("エラー: 0で割ることはできません。")
...
エラー: 0で割ることはできません。
```

`try` ブロック内で `ZeroDivisionError` が発生したため、プログラムはクラッシュせずに `except` ブロック内の処理が実行されました。
