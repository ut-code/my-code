---
id: python-oop-6-str-repr
title: 基本的なマジックメソッド (__str__, __repr__)
level: 2
---

## 基本的なマジックメソッド (`__str__`, `__repr__`)

`__init__`のように、アンダースコア2つで囲まれた特殊なメソッドを**マジックメソッド**（または**ダンダーメソッド**）と呼びます。これらを定義することで、Pythonの組み込み関数の挙動をカスタマイズできます。

  * `__str__(self)`
      * `print()`関数や`str()`でオブジェクトを文字列に変換する際に呼び出されます。
      * 目的は、**人間にとって読みやすい**、非公式な文字列表現を返すことです。
  * `__repr__(self)`
      * `repr()`関数で呼び出されるほか、`__str__`が定義されていない場合の`print()`や、インタラクティブシェルでオブジェクトを評価した際に使われます。
      * 目的は、**曖昧さのない**、公式な文字列表現を返すことです。理想的には、その文字列を評価すると同じオブジェクトを再作成できるような表現（例: `MyClass(arg1=1, arg2='B')`）が望ましいです。

```python:dog7.py
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    # print()で表示したときの振る舞いを定義
    def __str__(self):
        return f"名前: {self.name}, 年齢: {self.age}"

    # REPLでの評価やrepr()での振る舞いを定義
    def __repr__(self):
        return f"Dog(name='{self.name}', age={self.age})"

dog = Dog("ポチ", 3)

# print()は__str__を呼び出す
print(dog)

# str()も__str__を呼び出す
print(str(dog))

# repr()は__repr__を呼び出す
print(repr(dog))

# REPLやJupyter Notebookなどで変数をそのまま評価すると__repr__が表示される
# >>> dog
# Dog(name='ポチ', age=3)
```

```python-exec:dog7.py
名前: ポチ, 年齢: 3
名前: ポチ, 年齢: 3
Dog(name='ポチ', age=3)
```
