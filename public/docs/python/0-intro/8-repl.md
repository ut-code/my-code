---
id: python-intro-8-repl
title: REPL の基本的な使い方
level: 3
---

### REPL の基本的な使い方

* **計算:** 数式を直接入力すると、計算結果が返ってきます。
```python-repl:2
>>> 10 * 5 + 3
53
```
* **変数と関数の利用:** 変数を定義したり、`print()`のような組み込み関数を呼び出したりできます。
```python-repl:3
>>> greeting = "Hi there"
>>> print(greeting)
Hi there
```
* **ヘルプ機能:** `help()` と入力するとヘルプが表示されます。調べたいモジュールや関数名（例: `str`）を入力するとドキュメントが表示されます。
    * PCのターミナルで起動したREPLでは、対話的なヘルプモードが起動します。ヘルプモードを抜けるには `quit` と入力します。
```python-repl:4
>>> help(str)
Help on class str in module builtins:

class str(object)
 |  str(object='') -> str
 |  str(bytes_or_buffer[, encoding[, errors]]) -> str
 | ...
```
* **終了方法:** REPLを終了するには、`exit()` と入力するか、ショートカットキー（macOS/Linuxでは `Ctrl + D`、Windowsでは `Ctrl + Z` を押してからEnter）を使用します。
    * このウェブサイトに埋め込まれているREPLは、終了できません。
