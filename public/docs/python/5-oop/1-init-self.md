---
id: python-oop-1-init-self
title: コンストラクタ (__init__) と self
level: 2
---

## コンストラクタ (`__init__`) と `self`

Pythonのクラスでは、`__init__`という名前の特殊なメソッドがコンストラクタの役割を果たします。このメソッドは、クラスがインスタンス化される際に自動的に呼び出されます。

メソッドの最初の引数には`self`を書くのが慣習です。これはインスタンス自身への参照であり、JavaやC++の`this`に相当します。ただし、Pythonでは`self`を明示的に引数として記述する必要があります。

```python:dog2.py
class Dog:
    # インスタンス生成時に呼び出されるコンストラクタ
    def __init__(self, name, breed):
        print(f"{name}という名前の犬が作成されました。")
        # self.変数名 の形でインスタンス変数を定義
        self.name = name
        self.breed = breed

# インスタンス化する際に__init__のself以外の引数を渡すと、
# `__init__`メソッドが `self`に`my_dog`インスタンス、`name`に`"ポチ"`、`breed`に`"柴犬"`を受け取って実行される
my_dog = Dog("ポチ", "柴犬")

# インスタンス変数にアクセス
print(f"名前: {my_dog.name}")
print(f"犬種: {my_dog.breed}")
```

```python-exec:dog2.py
ポチという名前の犬が作成されました。
名前: ポチ
犬種: 柴犬
```
