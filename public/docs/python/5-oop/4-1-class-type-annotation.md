---
id: python-oop-class-type-annotation
title: クラスメンバーの型アノテーション
level: 3
question:
  - 型アノテーションを使うメリットは何ですか。
  - 型アノテーションは必須ですか、書かなくてもプログラムは動きますか。
  - インスタンス変数の型をクラス直下で宣言する場合と、__init__内で宣言する場合の違いは何ですか。
  - メソッドの引数や戻り値にも型アノテーションを付けることができますか。
---

### クラスメンバーの型アノテーション

型安全性を高めるために、クラス変数やインスタンス変数にも型アノテーション（型ヒント）を付けることができます。

  * **クラス変数**: `変数名: 型 = 値` のように記述します。
  * **インスタンス変数**: `__init__`内で `self.変数名: 型 = 値` のように記述するか、クラス直下で `変数名: 型` と宣言だけしておくこともできます。

```python:dog5.py
class Dog:
     # クラス変数の型アノテーション
    species: str = "イヌ科"

    # インスタンス変数の型を宣言
    name: str
    age: int

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    # メソッドの戻り値の型アノテーション
    def bark(self) -> str:
        return f"{self.name}: ワン！"

my_dog = Dog("ポチ", 3)
```

```python-exec:dog5.py
```
