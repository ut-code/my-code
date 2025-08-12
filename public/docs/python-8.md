# 第8章: エラーとの付き合い方：例外処理

プログラムの実行中に予期せぬ問題が発生すると、Pythonは「例外 (exception)」を送出して処理を中断します。これらのエラーを放置するとプログラムはクラッシュしてしまいますが、「例外処理」の仕組みを使うことで、エラーを優雅に捉えて対処できます。この章では、その方法を学びます。

## `try...except`による例外の捕捉

他の言語の `try...catch` と同様に、Pythonでは `try...except` ブロックを使います。エラーが発生する可能性のあるコードを `try` ブロックに記述し、エラーが発生した際の処理を `except` ブロックに記述します。

例えば、`0` で割り算をすると `ZeroDivisionError` という例外が発生します。

```python-repl
>>> 10 / 0
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ZeroDivisionError: division by zero
```

このエラーを `try...except` で捕捉してみましょう。

```python-repl
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

```python-repl
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

```python-repl
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

```python-repl
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

```python-repl
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