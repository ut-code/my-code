# 第4章: 制御構文と関数：Pythonらしい書き方

この章では、Pythonの基本的な制御構文（条件分岐、ループ）と関数の定義方法について学びます。他の言語にも同様の機能はありますが、特に`for`ループの振る舞いや、柔軟な引数の渡し方はPythonの大きな特徴です。これらの「Pythonらしい」書き方をマスターすることで、より簡潔で読みやすいコードを書けるようになります。

## if/elif/elseによる条件分岐

Pythonの条件分岐は`if`、`elif`（else ifの略）、`else`を使って記述します。C言語やJavaのような波括弧`{}`は使わず、**コロン`:`とインデント（通常は半角スペース4つ）**でコードブロックを表現するのが最大の特徴です。

```python-repl
>>> score = 85
>>> if score >= 90:
...     print('優')
... elif score >= 80:
...     print('良')
... elif score >= 70:
...     print('可')
... else:
...     print('不可')
...
良
```

条件式に`and`や`or`、`not`といった論理演算子も使用できます。

```python-repl
>>> temp = 25
>>> is_sunny = True
>>> if temp > 20 and is_sunny:
...     print("お出かけ日和です")
...
お出かけ日和です
```

## forループとrange()、enumerate()

Pythonの`for`ループは、他の言語の`for (int i = 0; i < 5; i++)`といったカウンタ変数を使うスタイルとは少し異なります。リストやタプル、文字列などの**イテラブル（反復可能）オブジェクト**から要素を1つずつ取り出して処理を実行します。これは、Javaの拡張for文やC\#の`foreach`に似ています。

```python-repl
>>> fruits = ['apple', 'banana', 'cherry']
>>> for fruit in fruits:
...     print(f"I like {fruit}")
...
I like apple
I like banana
I like cherry
```

### `range()` 関数

決まった回数のループを実行したい場合は、`range()`関数が便利です。`range(n)`は0からn-1までの連続した数値を生成します。

```python-repl
>>> for i in range(5):
...     print(i)
...
0
1
2
3
4
```

### `enumerate()` 関数

ループ処理の中で、要素のインデックス（番号）と値の両方を使いたい場合があります。そのような時は`enumerate()`関数を使うと、コードが非常にスッキリします。これは非常にPythonらしい書き方の一つです。

```python-repl
>>> fruits = ['apple', 'banana', 'cherry']
>>> for i, fruit in enumerate(fruits):
...     print(f"Index: {i}, Value: {fruit}")
...
Index: 0, Value: apple
Index: 1, Value: banana
Index: 2, Value: cherry
```

## whileループ

`while`ループは、指定された条件が`True`である間、処理を繰り返します。ループを途中で抜けたい場合は`break`を、現在の回の処理をスキップして次の回に進みたい場合は`continue`を使用します。

```python-repl
>>> n = 0
>>> while n < 5:
...     print(n)
...     n += 1
...
0
1
2
3
4
```

## 関数の定義 (def)

関数は`def`キーワードを使って定義します。ここでもコードブロックはコロン`:`とインデントで示します。値は`return`キーワードで返します。

```python-repl
>>> def greet(name):
...     """指定された名前で挨拶を返す関数"""  # これはDocstringと呼ばれるドキュメント文字列です
...     return f"Hello, {name}!"
...
>>> message = greet("Alice")
>>> print(message)
Hello, Alice!
```

引数と返り値に**型アノテーション（型ヒント）**を付けることもできます。これはコードの可読性を高め、静的解析ツールによるバグの発見を助けますが、実行時の動作に直接影響を与えるものではありません。
型アノテーションは `引数名: 型` のように記述し、返り値の型は `-> 型:` のように記述します。

```python-repl
>>> # typingモジュールからList型をインポート
>>> from typing import List
>>> def greet(name: str) -> str:
...     """指定された名前で挨拶を返す関数"""
...     return f"Hello, {name}!"
...
>>> message = greet("Alice")
>>> print(message)
Hello, Alice!
```

## 引数の渡し方（位置引数、キーワード引数、デフォルト引数値）

Pythonの関数は、非常に柔軟な引数の渡し方ができます。型アノテーションと組み合わせることで、どのような型の引数を期待しているかがより明確になります。

  * **位置引数 (Positional Arguments):** 最も基本的な渡し方で、定義された順序で値を渡します。
  * **キーワード引数 (Keyword Arguments):** `引数名=値`の形式で渡します。順序を問わないため、可読性が向上します。
  * **デフォルト引数値 (Default Argument Values):** 関数を定義する際に引数にデフォルト値を設定できます。呼び出し時にその引数が省略されると、デフォルト値が使われます。

```python-repl
>>> def describe_pet(animal_type: str, pet_name: str, owner_name: str = "Taro") -> None:
...     # この関数は何も値を返さないため、返り値の型は None となります
...     print(f"私には {animal_type} がいます。")
...     print(f"名前は {pet_name} で、飼い主は {owner_name} です。")
...
>>> # 位置引数のみで呼び出し
>>> describe_pet("ハムスター", "ジャンボ")
私には ハムスター がいます。
名前は ジャンボ で、飼い主は Taro です。
>>> # キーワード引数で呼び出し（順序を逆にしてもOK）
>>> describe_pet(pet_name="ポチ", animal_type="犬")
私には 犬 がいます。
名前は ポチ で、飼い主は Taro です。
>>> # デフォルト引数を持つ引数を指定して呼び出し
>>> describe_pet("猫", "ミケ", "Hanako")
私には 猫 がいます。
名前は ミケ で、飼い主は Hanako です。
```

**注意点:** デフォルト引数を持つ引数は、持たない引数の後に定義する必要があります。

## 可変長引数 (*args, **kwargs)

関数の引数の数が可変である場合に対応するための仕組みです。型アノテーションを使う場合は、`typing`モジュールから`Any`などをインポートすると便利です。

### `*args`

任意の数の**位置引数**をタプルとして受け取ります。型アノテーションでは `*args: 型` のように表現します。

```python-repl
>>> def sum_all(*numbers: int) -> int:
...     print(f"受け取ったタプル: {numbers}")
...     total = 0
...     for num in numbers:
...         total += num
...     return total
...
>>> print(sum_all(1, 2, 3))
受け取ったタプル: (1, 2, 3)
6
>>> print(sum_all(10, 20, 30, 40, 50))
受け取ったタプル: (10, 20, 30, 40, 50)
150
```

### `**kwargs`

任意の数の**キーワード引数**を辞書として受け取ります。型アノテーションでは `**kwargs: 型` のように表現します。どのような型の値も受け付ける場合は `Any` を使います。

```python-repl
>>> from typing import Any
>>> def print_profile(**user_info: Any) -> None:
...     print(f"受け取った辞書: {user_info}")
...     for key, value in user_info.items():
...         print(f"{key}: {value}")
...
>>> print_profile(name="Sato", age=28, city="Tokyo")
受け取った辞書: {'name': 'Sato', 'age': 28, 'city': 'Tokyo'}
name: Sato
age: 28
city: Tokyo
```

## ラムダ式（Lambda expressions）

`lambda`キーワードを使うと、名前のない小さな**無名関数**を定義できます。

構文: `lambda 引数: 式`

```python-repl
>>> # 通常の関数で2つの数を足す
>>> def add(x: int, y: int) -> int:
...     return x + y
...
>>> # ラムダ式で同じ処理を定義
>>> add_lambda = lambda x, y: x + y
>>> print(add_lambda(3, 5))
8
>>> # sorted関数のキーとして利用する例
>>> students = [('Taro', 80), ('Jiro', 95), ('Saburo', 75)]
>>> # 成績（タプルの2番目の要素）でソートする
>>> sorted_students = sorted(students, key=lambda student: student[1], reverse=True)
>>> print(sorted_students)
[('Jiro', 95), ('Taro', 80), ('Saburo', 75)]
```

## この章のまとめ

この章では、Pythonの制御構文と関数の基本を学びました。他の言語の経験がある方にとって、特に以下の点はPythonの特徴として重要です。

  * **インデントが構文の一部**: 波括弧`{}`の代わりにインデントでコードブロックを定義するため、自然と誰が書いても読みやすいコードスタイルになります。
  * **`for`ループはイテラブルを巡る**: `for item in collection:` の形が基本です。インデックスが必要な場合は、`for i, item in enumerate(collection):` のように`enumerate()`を使うのがPythonらしい書き方です。
  * **柔軟な関数引数**: **キーワード引数**、**デフォルト引数値**、そして**可変長引数 (`*args`, `**kwargs`)** を使いこなすことで、非常に柔軟で再利用性の高い関数を作成できます。
  * **型アノテーション**: 引数や返り値に型ヒントを付けることで、関数の意図が明確になり、コードの信頼性が向上します。
  * **ラムダ式**: ちょっとした処理をその場で関数として渡したい場合に、`lambda`はコードを簡潔に保つのに役立ちます。

これらの機能を理解し使いこなすことが、より効率的で「Pythonic（パイソニック）」なコードを書くための第一歩となります。

### 練習問題1: 偶数とそのインデックスの発見

数値のリストが与えられたとき、そのリストに含まれる**偶数**とその**インデックス（位置番号）**だけを出力するプログラムを書いてください。

**ヒント:**

  * `for`ループと`enumerate()`を組み合わせます。
  * 数値が偶数かどうかは、`%`（剰余）演算子を使って、2で割った余りが0になるかで判定できます (`number % 2 == 0`)。

```python:practice4-1.py
numbers: list[int] = [8, 15, 22, 37, 40, 51, 68]

```

```python-exec:practice4-1.py
(出力例)
インデックス: 0, 値: 8
インデックス: 2, 値: 22
インデックス: 4, 値: 40
インデックス: 6, 値: 68
```

### 練習問題2: ユーザープロフィール作成関数

ユーザーのプロフィール情報を出力する関数 `create_profile` を作成してください。引数と返り値には型アノテーションを付けてください。

**要件:**

1.  `name`（名前）は`str`型で、必須の引数とします。
2.  `age`（年齢）と `city`（都市）は`str`型で、キーワード引数として任意に受け取れるようにします。もし指定されなかった場合は、年齢は「秘密」、都市は「不明」と表示されるようにしてください。
3.  この関数は値を返さないものとします。
4.  関数を呼び出し、異なるパターンでプロフィールが出力されることを確認してください。

**ヒント:**

  * `age`と`city`にはデフォルト引数値を設定します。
  * 値を返さない関数の返り値の型アノテーションは `-> None` です。

```python:practice4-2.py
def create_profile(
```

```python-exec:practice4-2.py
(出力例)
--- プロフィール ---
名前: Tanaka
年齢: 秘密
都市: 不明
--------------------
--- プロフィール ---
名前: Sato
年齢: 32
都市: Osaka
--------------------
```
