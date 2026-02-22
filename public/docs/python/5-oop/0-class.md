---
id: python-oop-0-class
title: classの定義とインスタンス化
level: 2
---

## `class`の定義とインスタンス化

Pythonでは、`class`キーワードを使ってクラスを定義します。JavaやC++のように波括弧`{}`は使わず、インデントでブロックを示します。非常にシンプルです。

クラスを定義したら、関数を呼び出すように`クラス名()`と書くことで、そのクラスの**インスタンス**（オブジェクト）を生成できます。

```python:dog1.py
class Dog:
    pass # passは何もしないことを示す文

# Dogクラスのインスタンスを作成
my_dog = Dog()

print(my_dog)
```

```python-exec:dog1.py
<__main__.Dog object at 0x10e85a4d0> 
```
