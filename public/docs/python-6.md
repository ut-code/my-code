# 第6章: Pythonicなオブジェクト指向プログラミング

Pythonのオブジェクト指向プログラミング（OOP）は、他の言語と考え方は似ていますが、よりシンプルで柔軟な構文を持っています。この章では、クラスの定義から継承、そしてPython特有の「マジックメソッド」まで、その基本を学びます。

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

## インスタンス変数とクラス変数

Pythonのクラスには、2種類の変数があります。

  * **インスタンス変数**: `self.変数名`のように`__init__`内などで定義され、**各インスタンスに固有**の値を持ちます。上の例の`name`や`age`がこれにあたります。
  * **クラス変数**: クラス定義の直下に書かれ、そのクラスから作られた**全てのインスタンスで共有**されます。

```python:dog3.py
class Dog:
    # このクラスから作られるインスタンス全てで共有されるクラス変数
    species = "イヌ科"

    def __init__(self, name):
        # このインスタンス固有のインスタンス変数
        self.name = name

dog1 = Dog("ポチ")
dog2 = Dog("ハチ")

# インスタンス変数へのアクセス
print(f"{dog1.name}も{dog2.name}も、")

# クラス変数へのアクセス (インスタンス経由でもクラス経由でも可能)
print(f"種は同じく {dog1.species} です。")
print(f"Dogクラスの種は {Dog.species} です。")

# クラス変数を変更すると、全てのインスタンスに影響が及ぶ
Dog.species = "ネコ科"
print(f"{dog1.name}の種は {dog1.species}")
print(f"{dog2.name}の種は {dog2.species}")
```

```python-exec:dog3.py
ポチもハチも、
種は同じく イヌ科 です。
Dogクラスの種は イヌ科 です。
ポチの種は ネコ科
ハチの種は ネコ科
```

## メソッドの定義

クラス内で定義される関数をメソッドと呼びます。インスタンスのデータ（インスタンス変数）を操作するために使用します。
メソッドを定義する際も、最初の引数には必ず`self`を指定する必要があります。これにより、メソッド内から`self`を通じてインスタンス変数にアクセスできます。

```python:dog4.py
class Dog:
    def __init__(self, name):
        self.name = name

    # barkというメソッドを定義
    # selfを介してインスタンス変数nameにアクセスする
    def bark(self):
        return f"{self.name}: ワン！"

my_dog = Dog("ポチ")
print(my_dog.bark()) # メソッドの呼び出し
```

```python-exec:dog4.py
ポチ: ワン！
```

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

## 継承

あるクラスの機能を引き継いだ新しいクラスを作成することを継承と呼びます。Pythonでは、クラス定義の際に`()`内に親クラス（基底クラス）を指定することで継承を行います。

子クラス（派生クラス）は親クラスのメソッドや変数を全て利用でき、必要に応じて上書き（オーバーライド）することも可能です。親クラスのメソッドを呼び出したい場合は`super()`を使います。

```python:dog6.py
# 親クラス
class Animal:
    def __init__(self, name: str):
        print("Animalの__init__が呼ばれました")
        self.name = name

    def eat(self) -> str:
         return f"{self.name}は食事中です。"

    def speak(self) -> str:
        return "..."

# Animalクラスを継承した子クラス
class Dog(Animal):
    def __init__(self, name: str, breed: str):
      print("Dogの__init__が呼ばれました")
      # super()で親クラスの__init__を呼び出し、nameを初期化
      super().__init__(name)
      self.breed = breed  # Dogクラス独自のインスタンス変数を追加

    # 親のメソッドをオーバーライド
    def speak(self) -> str:
        return f"{self.name}: ワン！"
    
    
dog = Dog("ポチ", "柴犬")

# 親クラスのメソッドも使える
print(dog.eat())
# オーバーライドしたメソッドが呼ばれる
print(dog.speak())
```

```python-exec:dog6.py
Dogの__init__が呼ばれました
Animalの__init__が呼ばれました
ポチは食事中です。
ポチ: ワン！
```

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

## この章のまとめ

  * **クラス定義**: `class ClassName:` で定義する。
  * **コンストラクタ**: `__init__(self, ...)` メソッドで、インスタンス化の際に初期化処理を行う。
  * **`self`**: インスタンス自身を指す参照。メソッドの第一引数として必ず記述する。
  * **変数**: インスタンスごとに持つ**インスタンス変数**と、全インスタンスで共有する**クラス変数**がある。
  * **継承**: `class Child(Parent):` でクラスの機能を引き継ぐ。親のメソッドは`super()`で呼び出せる。
  * **マジックメソッド**: `__str__`や`__repr__`などを定義することで、オブジェクトの振る舞いをカスタマイズできる。

## この章のまとめ

この章では、Pythonにおけるオブジェクト指向プログラミングの基本を学びました。

  * **クラスとインスタンス**: `class`キーワードでクラスという「設計図」を定義し、`クラス名()`でインスタンスという「実体」を作成します。
  * **`__init__`と`self`**: `__init__`はインスタンス化の際に呼ばれるコンストラクタです。第一引数の`self`はインスタンス自身を指し、`self.変数名`の形でインスタンスごとにユニークな**インスタンス変数**を定義します。
  * **クラス変数**: クラス直下に定義され、全てのインスタンスで共有される変数です。
  * **メソッド**: クラス内で定義される関数で、インスタンスの振る舞いを表します。メソッドの第一引数も必ず`self`です。
  * **継承**: `class 子クラス(親クラス):`と書くことで、親クラスの機能を引き継いだ新しいクラスを作成できます。`super()`を使うことで、親クラスのメソッドを呼び出せます。
  * **マジックメソッド**: `__str__`や`__repr__`のように`__`で囲まれた特殊なメソッドで、`print()`などの組み込み関数の挙動をカスタマイズできます。

PythonのOOPは、JavaやC++に比べてシンプルで直感的な構文が特徴です。しかし、その裏側にある「すべてがオブジェクトである」という思想は一貫しており、非常に強力なプログラミングパラダイムです。

### 練習問題1: `Book`クラスの作成

書籍の情報を管理する`Book`クラスを作成してください。

**要件:**

1.  インスタンス化する際に、`title`（タイトル）と`author`（著者）を引数で受け取る。
2.  `info()`というメソッドを持ち、呼び出すと`「{タイトル}」- {著者}`という形式の文字列を返す。
3.  `print()`でインスタンスを直接表示した際に、`info()`メソッドと同じ文字列が表示されるようにする。

```python:practice6_1.py
class Book:


if __name__ == "__main__":
    harry_potter = Book("ハリー・ポッターと賢者の石", "J.K. ローリング")
    print(harry_potter.info())
    print(harry_potter)
```

```python-exec:practice6_1.py
「ハリー・ポッターと賢者の石」- J.K. ローリング
「ハリー・ポッターと賢者の石」- J.K. ローリング
```

#### 練習問題2: 継承を使った`EBook`クラスの作成

問題1で作成した`Book`クラスを継承して、電子書籍を表す`EBook`クラスを作成してください。

**要件:**

1.  `Book`クラスを継承する。
2.  インスタンス化の際に、`title`、`author`に加えて`file_size`（ファイルサイズ、MB単位）も引数で受け取る。
3.  `info()`メソッドを**オーバーライド**し、呼び出すと`「{タイトル}」- {著者} (ファイルサイズ: {file_size}MB)`という形式の文字列を返すように変更する。

```python:practice6_2.py
from practice6_1 import Book

class EBook(Book):
    

if __name__ == "__main__":
    ebook_version = EBook("Python実践入門", "掌田 津耶乃", 24)
    print(ebook_version.info())
```

```python-exec:practice6_2.py
「Python実践入門」- 掌田 津耶乃 (ファイルサイズ: 24MB)
```
