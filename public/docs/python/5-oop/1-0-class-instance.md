---
id: python-oop-class-instance
title: classの定義とインスタンス化
level: 2
question:
  - classとは具体的に何をするものですか。
  - passは何のために使うのですか、書かないとどうなりますか。
  - インスタンス化とはどういうことですか、なぜ必要なのでしょうか。
  - my_dogをprintすると表示される<__main__.Dog object at 0x...>は何を意味しますか。
  - クラス名は必ず大文字から始めるべきですか。
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
