# 第8章: エラーとの付き合い方：例外処理

プログラムの実行中に予期せぬ問題が発生すると、Pythonは「例外 (exception)」を送出して処理を中断します。これらのエラーを放置するとプログラムはクラッシュしてしまいますが、「例外処理」の仕組みを使うことで、エラーを優雅に捉えて対処できます。この章では、その方法を学びます。

## `try...except`による例外の捕捉

他の言語の `try...catch` と同様に、Pythonでは `try...except` ブロックを使います。エラーが発生する可能性のあるコードを `try` ブロックに記述し、エラーが発生した際の処理を `except` ブロックに記述します。

例えば、`0` で割り算をすると `ZeroDivisionError` という例外が発生します。

```python-repl:1
>>> 10 / 0
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ZeroDivisionError: division by zero
```

このエラーを `try...except` で捕捉してみましょう。

```python-repl:2
>>> try:
...   result = 10 / 0
... except ZeroDivisionError:
...   print("エラー: 0で割ることはできません。")
...
エラー: 0で割ることはできません。
```

`try` ブロック内で `ZeroDivisionError` が発生したため、プログラムはクラッシュせずに `except` ブロック内の処理が実行されました。

## 複数の例外を処理する方法

`try` ブロック内では、複数の種類のエラーが発生する可能性があります。例えば、ユーザーの入力を数値に変換しようとして失敗した場合は `ValueError` が発生します。

複数の例外を処理するには、2つの方法があります。

**1. `except` ブロックを複数記述する**

エラーの種類ごとに異なる処理を行いたい場合に適しています。

```python-repl:3
>>> def calculate(a, b):
...   try:
...     a = int(a)
...     b = int(b)
...     result = a / b
...     print(f"計算結果: {result}")
...   except ValueError:
...     print("エラー: 数値を入力してください。")
...   except ZeroDivisionError:
...     print("エラー: 0で割ることはできません。")
...
>>> calculate(10, 2)
計算結果: 5.0
>>> calculate(10, 0)
エラー: 0で割ることはできません。
>>> calculate('ten', 2)
エラー: 数値を入力してください。
```

**2. 1つの `except` ブロックでタプルを使ってまとめる**

複数の例外に対して同じ処理を行いたい場合に便利です。

```python-repl:4
>>> def calculate_v2(a, b):
...   try:
...     a = int(a)
...     b = int(b)
...     result = a / b
...     print(f"計算結果: {result}")
...   except (ValueError, ZeroDivisionError) as e:
...     print(f"入力エラーが発生しました: {e}")
...
>>> calculate_v2(20, 0)
入力エラーが発生しました: division by zero
>>> calculate_v2('twenty', 5)
入力エラーが発生しました: invalid literal for int() with base 10: 'twenty'
```

`as e` のように書くことで、発生した例外オブジェクトそのものを変数 `e` で受け取ることができます。これにより、具体的なエラーメッセージを表示できます。

## 独自例外の送出 (`raise`)

特定の条件を満たした場合に、意図的に例外を発生させたいことがあります。その場合は `raise` 文を使います。

例えば、負の値を受け付けない関数を考えてみましょう。

```python-repl:5
>>> def process_positive_number(num):
...   if num < 0:
...     raise ValueError("負の値は処理できません。")
...   print(f"{num}を処理しました。")
...
>>> process_positive_number(100)
100を処理しました。
>>> process_positive_number(-5)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in process_positive_number
ValueError: 負の値は処理できません。
```

このように、`raise` を使うことで、関数の事前条件などを満たさない場合に、プログラムの実行を中断して呼び出し元にエラーを通知できます。

## `else`と`finally`節の役割

`try...except` ブロックには、`else` と `finally` という2つのオプションの節を追加できます。

  * **`else` 節**: `try` ブロックで**例外が発生しなかった場合**にのみ実行されます。
  * **`finally` 節**: 例外の有無に**関わらず、必ず最後に**実行されます。ファイルクローズやデータベース接続の切断など、後片付け処理に最適です。

すべての節を使った例を見てみましょう。

```python-repl:6
>>> def divider(a, b):
...   print(f"--- {a} / {b} の計算を開始します ---")
...   try:
...     result = a / b
...   except ZeroDivisionError:
...     print("エラー: 0による除算です。")
...   else:
...     # 例外が発生しなかった場合に実行
...     print(f"計算成功！ 結果: {result}")
...   finally:
...     # 常に最後に実行
...     print("--- 計算を終了します ---")
...
>>> # 成功するケース
>>> divider(10, 2)
--- 10 / 2 の計算を開始します ---
計算成功！ 結果: 5.0
--- 計算を終了します ---

>>> # 例外が発生するケース
>>> divider(10, 0)
--- 10 / 0 の計算を開始します ---
エラー: 0による除算です。
--- 計算を終了します ---
```

この例から、実行フローが明確にわかります。

  * 成功ケースでは `try` -\> `else` -\> `finally` の順に実行されます。
  * 失敗ケースでは `try` -\> `except` -\> `finally` の順に実行されます。

`finally` 節は、`try` ブロック内で `return` が実行される場合でも、その `return` の直前に実行されることが保証されています。これにより、リソースの解放漏れなどを防ぐことができます。

## この章のまとめ

この章では、Pythonにおけるエラー処理の基本を学びました。重要なポイントを振り返りましょう。

  * **例外**: Pythonでは、エラーは「例外」オブジェクトとして扱われます。例外が発生すると、プログラムの実行は中断されます。
  * `try...except`: 例外が発生する可能性のあるコードを `try` ブロックで囲み、`except` ブロックで捕捉することで、プログラムのクラッシュを防ぎ、エラーに応じた処理を実行できます。
  * **複数の例外処理**: `except` ブロックを複数記述したり、タプルでまとめたりすることで、さまざまな種類のエラーに柔軟に対応できます。
  * `raise`: 特定の条件で意図的に例外を発生させ、プログラムに異常な状態を通知します。
  * `else` と `finally`: `try` ブロックが成功した場合の処理を `else` に、成功・失敗にかかわらず必ず実行したい後片付け処理を `finally` に記述することで、より堅牢なコードを書くことができます。

例外処理をマスターすることは、予期せぬ入力や状況に強い、安定したプログラムを作成するための重要なステップです。

### 練習問題1: 安全なリスト要素の取得

リストとインデックスを受け取り、そのインデックスに対応する要素を返す `safe_get(my_list, index)` という関数を作成してください。

**要件:**

1.  インデックスがリストの範囲外の場合 (`IndexError`)、「指定されたインデックスは範囲外です。」と表示してください。
2.  インデックスが整数でない場合 (`TypeError`)、「インデックスは整数で指定してください。」と表示してください。
3.  正常に要素を取得できた場合は、その要素を返してください。

```python:practice8_1.py
def safe_get(my_list, index):


data = ['apple', 'banana', 'cherry']
print(safe_get(data, 1))
print(safe_get(data, 3))
print(safe_get(data, 'zero'))
```

```python-exec:practice8_1.py
(出力例)
banana
指定されたインデックスは範囲外です。
インデックスは整数で指定してください。
```

### 練習問題2: ユーザー年齢の検証

ユーザーの年齢を入力として受け取り、18歳以上であれば「あなたは成人です。」と表示する `check_age(age_str)` という関数を作成してください。

**要件:**

1.  関数内部で、受け取った文字列を整数に変換してください。変換できない場合 (`ValueError`) は、`ValueError` を `raise` して、「有効な数値を入力してください。」というメッセージを伝えてください。
2.  変換した数値が負の値である場合、`ValueError` を `raise` して、「年齢に負の値は指定できません。」というメッセージを伝えてください。
3.  年齢が0歳から17歳までの場合は、「あなたは未成年です。」と表示してください。
4.  関数の呼び出し側で、`raise` された例外も捕捉できるようにしてください。

```python:practice8_2.py
def check_age(age_str):


# 正常ケース
print(check_age("20"))
print(check_age("15"))

# 例外ケース
print(check_age("abc"))
print(check_age("-5"))
```

```python-exec:practice8_2.py
(出力例)
あなたは成人です。
あなたは未成年です。
Traceback (most recent call last):
    ...
ValueError: 有効な数値を入力してください。
```
