# 第7章: ファイルの入出力とコンテキストマネージャ

この章では、テキストファイルやJSON、CSVファイルの読み書きといった、実践的なファイル操作を学びます。特に、リソース管理を安全かつ簡潔に行うための **`with`** 文（コンテキストマネージャ）は、Pythonプログラミングにおいて必須の知識です。

## `open()`関数によるファイルのオープン

Pythonでファイルを操作するには、まず組み込み関数の **`open()`** を使ってファイルオブジェクトを取得します。`open()` は少なくとも2つの引数、ファイルパスとモードを取ります。

  * **ファイルパス**: 操作したいファイルへのパス（例: `'data.txt'`）。
  * **モード**: ファイルをどのように開くかを指定する文字列。
      * `'r'`: 読み込み専用（デフォルト）
      * `'w'`: 書き込み専用（ファイルが存在すれば上書き）
      * `'a'`: 追記（ファイルの末尾に書き足す）
      * `'x'`: 新規作成して書き込み（ファイルが存在するとエラー）
      * `'+'` を付けると読み書き両用になります（例: `'r+'`, `'w+'`）。
      * `'b'` を付けるとバイナリモードになります（例: `'rb'`, `'wb'`）。

<!-- end list -->

```python
>>> # 'w' モードでファイルを開く（または新規作成する）
>>> f = open('spam.txt', 'w', encoding='utf-8')
>>> f
<_io.TextIOWrapper name='spam.txt' mode='w' encoding='utf-8'>
>>> # ファイルを使い終わったら必ず閉じる
>>> f.close()
```

**`encoding='utf-8'`** は、特に日本語のような非ASCII文字を扱う際に重要です。文字化けを防ぐため、テキストファイルを扱う際はエンコーディングを明示的に指定することを強く推奨します。ファイルを閉じる **`close()`** メソッドを呼び出すまで、ファイルリソースはプログラムによって確保されたままになります。


## テキストファイルの読み書き

ファイルオブジェクトのメソッドを使って、ファイルの内容を操作します。

### 書き込み

**`write()`** メソッドは、文字列をファイルに書き込みます。このメソッドは書き込んだ文字数を返します。

```python
>>> f = open('test.txt', 'w', encoding='utf-8')
>>> f.write('こんにちは、世界！\n')
9
>>> f.write('これは2行目です。\n')
9
>>> f.close()
```

`write()` は自動的には改行しないため、必要であれば自分で改行コード `\n` を追加します。

### 読み込み

ファイルからデータを読み込むには、いくつかの方法があります。

  * **`read()`**: ファイルの内容全体を一つの文字列として読み込みます。
  * **`readline()`**: ファイルから1行だけを読み込み、文字列として返します。
  * **`readlines()`**: ファイルのすべての行を読み込み、各行を要素とするリストで返します。

<!-- end list -->

```python
>>> # 先ほど書き込んだファイルを読み込む
>>> f = open('test.txt', 'r', encoding='utf-8')
>>> content = f.read()
>>> print(content)
こんにちは、世界！
これは2行目です。

>>> f.close()

>>> # readline() を使って1行ずつ読む
>>> f = open('test.txt', 'r', encoding='utf-8')
>>> f.readline()
'こんにちは、世界！\n'
>>> f.readline()
'これは2行目です。\n'
>>> f.readline() # ファイルの終端に達すると空文字列を返す
''
>>> f.close()
```


## `with`文による安全なファイル操作（コンテキストマネージャ）

ファイルを `open()` したら `close()` する必要がありますが、処理中に例外が発生すると `close()` が呼ばれない可能性があります。これを確実に、そして簡潔に書く方法が **`with`** 文です。

**`with`** 文のブロックを抜けると、ファイルオブジェクトは自動的に `close()` されます。エラーが発生した場合でも同様です。これは「コンテキストマネージャ」という仕組みによって実現されており、ファイル操作の標準的な方法です。

```python
>>> # with文を使った書き込み
>>> with open('spam.txt', 'w', encoding='utf-8') as f:
...     f.write('withブロックを使っています。\n')
...     f.write('ブロックを抜けると自動で閉じられます。\n')
... 
>>> # ブロックの外ではファイルは閉じている
>>> f.closed
True

>>> # with文を使った読み込み
>>> with open('spam.txt', 'r', encoding='utf-8') as f:
...     data = f.read()
... 
>>> print(data)
withブロックを使っています。
ブロックを抜けると自動で閉じられます。

```

このように、`with` 文を使えば `close()` の呼び出しを忘れる心配がなく、コードもすっきりします。今後は常に `with` 文を使ってファイルを扱うようにしましょう。


## `json`モジュールを使ったJSONの操作

**JSON (JavaScript Object Notation)** は、データ交換フォーマットとして広く使われています。Pythonの標準ライブラリである **`json`** モジュールを使うと、Pythonのオブジェクト（辞書やリストなど）をJSON形式のデータに、またはその逆に変換できます。

  * **`json.dump(obj, fp)`**: Pythonオブジェクト `obj` をJSON形式でファイルオブジェクト `fp` に書き込みます。
  * **`json.load(fp)`**: JSON形式のファイルオブジェクト `fp` からデータを読み込み、Pythonオブジェクトに変換します。

<!-- end list -->

```python
>>> import json

>>> # 書き込むデータ（Pythonの辞書）
>>> data = {
...     "name": "Taro Yamada",
...     "age": 30,
...     "is_student": False,
...     "courses": ["Python", "Machine Learning"]
... }

>>> # with文を使ってJSONファイルに書き込む
>>> with open('user.json', 'w', encoding='utf-8') as f:
...     # ensure_ascii=Falseで日本語をそのまま出力
...     json.dump(data, f, indent=4, ensure_ascii=False)
... 

>>> # JSONファイルから読み込む
>>> with open('user.json', 'r', encoding='utf-8') as f:
...     loaded_data = json.load(f)
... 
>>> loaded_data
{'name': 'Taro Yamada', 'age': 30, 'is_student': False, 'courses': ['Python', 'Machine Learning']}
>>> loaded_data['name']
'Taro Yamada'
```

`json.dump()` の `indent=4` は、人間が読みやすいように4スペースのインデントを付けて出力するオプションです。`ensure_ascii=False` は、日本語などの非ASCII文字をそのままの文字で出力するために指定します。


## `csv`モジュールを使ったCSVの操作

**CSV (Comma-Separated Values)** は、スプレッドシートやデータベースでよく使われる表形式のデータを保存するためのフォーマットです。**`csv`** モジュールを使うと、CSVファイルの読み書きが簡単になります。

### CSVファイルへの書き込み

**`csv.writer()`** を使ってライターオブジェクトを作成し、**`writerow()`** (1行) や **`writerows()`** (複数行) メソッドでデータを書き込みます。

```python
>>> import csv

>>> # 書き込むデータ（リストのリスト）
>>> data_to_write = [
...     ["ID", "Name", "Score"],
...     [1, "Alice", 95],
...     [2, "Bob", 88],
...     [3, "Charlie", 76]
... ]

>>> # newline='' はWindowsでの不要な空行を防ぐためのおまじない
>>> with open('scores.csv', 'w', newline='', encoding='utf-8') as f:
...     writer = csv.writer(f)
...     writer.writerows(data_to_write)
... 
```

### CSVファイルの読み込み

**`csv.reader()`** を使ってリーダーオブジェクトを作成します。このオブジェクトをループで回すことで、1行ずつリストとしてデータを取得できます。

```python
>>> import csv

>>> with open('scores.csv', 'r', newline='', encoding='-utf-8') as f:
...     reader = csv.reader(f)
...     # リーダーオブジェクトはイテレータなのでforループで回せる
...     for row in reader:
...         print(row)
... 
['ID', 'Name', 'Score']
['1', 'Alice', '95']
['2', 'Bob', '88']
['3', 'Charlie', '76']
```

注意点として、`csv`モジュールはすべてのデータを文字列として読み込みます。数値として扱いたい場合は、自分で `int()` や `float()` を使って型変換する必要があります。