---
id: python-control-functions-1-forrangeenumerate
title: forループとrange()、enumerate()
level: 2
---

## forループとrange()、enumerate()

Pythonの`for`ループは、他の言語の`for (int i = 0; i < 5; i++)`といったカウンタ変数を使うスタイルとは少し異なります。リストやタプル、文字列などの**イテラブル（反復可能）オブジェクト**から要素を1つずつ取り出して処理を実行します。これは、Javaの拡張for文やC\#の`foreach`に似ています。

```python-repl:3
>>> fruits = ['apple', 'banana', 'cherry']
>>> for fruit in fruits:
...     print(f"I like {fruit}")
...
I like apple
I like banana
I like cherry
```
