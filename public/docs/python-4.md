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

## 引数の渡し方（位置引数、キーワード引数、デフォルト引数値）

Pythonの関数は、非常に柔軟な引数の渡し方ができます。

* **位置引数 (Positional Arguments):** 最も基本的な渡し方で、定義された順序で値を渡します。
* **キーワード引数 (Keyword Arguments):** `引数名=値`の形式で渡します。順序を問わないため、可読性が向上します。
* **デフォルト引数値 (Default Argument Values):** 関数を定義する際に引数にデフォルト値を設定できます。呼び出し時にその引数が省略されると、デフォルト値が使われます。

```python-repl
>>> def describe_pet(animal_type, pet_name, owner_name="Taro"):
...     print(f"私には {animal_type} がいます。")
...     print(f"名前は {pet_name} で、飼い主は {owner_name} です。")
...

# 位置引数のみで呼び出し
>>> describe_pet("ハムスター", "ジャンボ")
私には ハムスター がいます。
名前は ジャンボ で、飼い主は Taro です。

# キーワード引数で呼び出し（順序を逆にしてもOK）
>>> describe_pet(pet_name="ポチ", animal_type="犬")
私には 犬 がいます。
名前は ポチ で、飼い主は Taro です。

# デフォルト引数を持つ引数を指定して呼び出し
>>> describe_pet("猫", "ミケ", "Hanako")
私には 猫 がいます。
名前は ミケ で、飼い主は Hanako です。
```

**注意点:** デフォルト引数を持つ引数は、持たない引数の後に定義する必要があります。

## 可変長引数 (\*args, \*\*kwargs)

関数の引数の数が可変である場合に対応するための仕組みです。

### `*args`

任意の数の**位置引数**をタプルとして受け取ります。慣習的に`args`という名前が使われます。

```python-repl
>>> def sum_all(*numbers):
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

任意の数の**キーワード引数**を辞書として受け取ります。慣習的に`kwargs` (keyword arguments) という名前が使われます。

```python-repl
>>> def print_profile(**user_info):
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

`lambda`キーワードを使うと、名前のない小さな**無名関数**を定義できます。複雑な処理には向きませんが、`sorted`関数のキーを指定したり、GUIのコールバック関数を定義したりと、簡単な処理をその場で記述したい場合に非常に便利です。

構文: `lambda 引数: 式`

```python-repl
# 通常の関数で2つの数を足す
>>> def add(x, y):
...     return x + y
...

# ラムダ式で同じ処理を定義
>>> add_lambda = lambda x, y: x + y
>>> print(add_lambda(3, 5))
8

# sorted関数のキーとして利用する例
>>> students = [('Taro', 80), ('Jiro', 95), ('Saburo', 75)]
# 成績（タプルの2番目の要素）でソートする
>>> sorted_students = sorted(students, key=lambda student: student[1], reverse=True)
>>> print(sorted_students)
[('Jiro', 95), ('Taro', 80), ('Saburo', 75)]
```
