# 第5章: コードの整理術：モジュールとパッケージ

プログラミングを進めていくと、コードは必然的に長くなり、一つのファイルで管理するのが難しくなってきます。機能ごとにファイルを分割し、再利用しやすく、メンテナンスしやすい構造にすることが、効率的な開発の鍵となります。この章では、Pythonでコードを整理するための**モジュール**と**パッケージ**という仕組み、そしてPythonの強力な武器である**標準ライブラリ**の活用方法について学びます。

## モジュール：コードを部品化する

Pythonでは、**1つの `.py` ファイルが1つのモジュール**として扱われます。モジュールを使うことで、関連する関数やクラスを一つのファイルにまとめ、他のプログラムから再利用可能な「部品」として扱うことができます。これは、他の言語におけるライブラリやソースファイルのインポート機能に似ています。

### `import`文の基本

モジュールを利用するには `import` 文を使います。Pythonには多くの便利なモジュールが標準で用意されています（これらを**標準ライブラリ**と呼びます）。例えば、数学的な計算を行う `math` モジュールを使ってみましょう。

```python-repl
>>> # mathモジュールをインポート
>>> import math
>>> # mathモジュール内の変数や関数を利用する
>>> print(math.pi)  # 円周率π
3.141592653589793
>>> print(math.sqrt(16))  # 16の平方根
4.0
```

出力:

```
3.141592653589793
4.0
```

毎回 `math.` と書くのが面倒な場合は、いくつかの書き方があります。

  * **`from ... import ...`**: モジュールから特定の関数や変数だけを取り込む

    ```python-repl
    >>> from math import pi, sqrt
    >>>
    >>> print(pi)       # 直接piを参照できる
    3.141592653589793
    >>> print(sqrt(16)) # 直接sqrtを参照できる
    4.0
    ```

  * **`as` (別名)**: モジュールに別名をつけて利用する

    ```python-repl
    >>> import math as m
    >>>
    >>> print(m.pi)
    3.141592653589793
    >>> print(m.sqrt(16))
    4.0
    ```

> **注意** ⚠️: `from math import *` のようにアスタリスク (`*`) を使うと、そのモジュールのすべての名前（関数、変数、クラス）が現在の名前空間にインポートされます。一見便利に見えますが、どの名前がどこから来たのか分からなくなり、意図しない名前の上書きを引き起こす可能性があるため、**特別な理由がない限り避けるべき**です。

### 自作モジュールの作成と利用

自分でモジュールを作成するのも簡単です。関連する関数をまとめた `.py` ファイルを作成するだけです。ここからは複数のファイルが必要になるため、再びスクリプトファイルで説明します。

1.  **`utils.py` の作成**:
    まず、便利な関数をまとめた `utils.py` というファイルを作成します。

    ```python:utils.py
    def say_hello(name):
        """指定された名前で挨拶を返す"""
        return f"Hello, {name}!"

    def get_list_average(numbers):
        """数値リストの平均を計算する"""
        if not numbers:
            return 0
        return sum(numbers) / len(numbers)

    # このファイルが直接実行された場合にのみ以下のコードを実行
    if __name__ == "__main__":
        print("This is a utility module.")
        print(say_hello("World"))
        avg = get_list_average([10, 20, 30])
        print(f"Average: {avg}")
    ```

    ```python-exec:utils.py
    This is a utility module.
    Hello, World!
    Average: 20.0
    ```

    > **`if __name__ == "__main__":` の重要性**
    > この記述はPythonの定型句です。

    >   * スクリプトが**直接実行された**場合、そのスクリプトの `__name__` という特殊変数は `"__main__"` になります。
    >   * スクリプトが**モジュールとして `import` された**場合、`__name__` はファイル名（この場合は `"utils"`）になります。
    >     これにより、モジュールとしてインポートされた際には実行したくないテストコードやデモコードを記述することができます。他言語経験者にとっては、プログラムの「エントリーポイント」を定義する `main` 関数のような役割と考えると分かりやすいでしょう。

2.  **`main.py` からの利用**:
    次に、`utils.py` と同じディレクトリに `main.py` を作成し、`utils` モジュールをインポートして使います。

    ```python:main.py
    # 自作のutilsモジュールをインポート
    import utils

    greeting = utils.say_hello("Alice")
    print(greeting)

    scores = [88, 92, 75, 100]
    average_score = utils.get_list_average(scores)
    print(f"Your average score is: {average_score}")
    ```

    ```python-exec:main.py
    Hello, Alice!
    Your average score is: 88.75
    ```

このように、機能ごとにファイルを分割することで、コードの見通しが良くなり、再利用も簡単になります。


## パッケージ：モジュールをまとめる

プロジェクトがさらに大きくなると、多数のモジュールを管理する必要が出てきます。**パッケージ**は、複数のモジュールをディレクトリ構造で階層的に管理するための仕組みです。

### パッケージの概念と `__init__.py`

パッケージは、簡単に言うと**モジュールが入ったディレクトリ**です。Pythonにそのディレクトリをパッケージとして認識させるために、`__init__.py` という名前のファイルを置きます（近年のPythonでは必須ではありませんが、互換性や明示性のために置くのが一般的です）。

以下のようなディレクトリ構造を考えてみましょう。

```
my_project/
├── main.py
└── my_app/
    ├── __init__.py
    ├── models.py
    └── services.py
```

  * `my_app` がパッケージ名になります。
  * `__init__.py` は空でも構いません。このファイルが存在することで、`my_app` ディレクトリは単なるフォルダではなく、Pythonのパッケージとして扱われます。
  * `models.py` と `services.py` が、`my_app` パッケージに含まれるモジュールです。

`main.py` からこれらのモジュールをインポートするには、`パッケージ名.モジュール名` のように記述します。

```python
# パッケージ内のモジュールをインポート
from my_app import services

# servicesモジュール内の関数を実行 (仮の関数)
# user_data = services.fetch_user_data(user_id=123)
# print(user_data)
```

`__init__.py` には、パッケージがインポートされた際の初期化処理を記述することもできます。例えば、特定のモジュールから関数をパッケージのトップレベルにインポートしておくと、利用側でより短い記述でアクセスできるようになります。

```python
# my_app/__init__.py

# servicesモジュールからfetch_user_data関数をインポート
from .services import fetch_user_data

print("my_app package has been initialized.")
```

このようにしておくと、`main.py` から以下のように直接関数をインポートできます。

```python
# main.py

# __init__.pyで設定したおかげで、短いパスでインポートできる
from my_app import fetch_user_data

user_data = fetch_user_data(user_id=123)
print(user_data)
```

## 標準ライブラリ：Pythonに備わった強力なツール群

Pythonの大きな魅力の一つは、その「**バッテリー同梱 (Batteries Included)**」という哲学です。これは、Pythonをインストールしただけで、追加のインストールなしにすぐに使える膨大で強力な**標準ライブラリ**が付属していることを意味します。

### 標準ライブラリの探索

どんなライブラリがあるかを知るには、公式ドキュメントが最も信頼できます。

  * [**The Python Standard Library — Python 3.x documentation**](https://docs.python.org/3/library/index.html)

また、REPLの `help()` や `dir()` を使うと、モジュールの内容を簡単に確認できます。

```python-repl
>>> import datetime
>>> # datetimeモジュールが持つ属性や関数のリストを表示
>>> dir(datetime)
['MAXYEAR', 'MINYEAR', '__all__', '__builtins__', ..., 'date', 'datetime', 'time', 'timedelta', 'timezone', 'tzinfo']
>>>
>>> # dateクラスのヘルプドキュメントを表示
>>> help(datetime.date)
Help on class date in module datetime:

class date(builtins.object)
 |  date(year, month, day) --> a date object
 |
 |  Methods defined here:
(ヘルプ情報が続く) ...
```

### よく使われる標準ライブラリの例

ここでは、日常的によく使われる標準ライブラリをいくつか紹介します。

  * **`os`**: オペレーティングシステムと対話するための機能を提供します。ファイルやディレクトリの操作、環境変数の取得などができます。

    ```python-repl
    >>> import os
    >>> # カレントディレクトリのファイル一覧を取得
    >>> os.listdir('.')
    ['hello.py', 'utils.py', 'main.py']
    >>> # OSに依存しない安全なパスの結合
    >>> os.path.join('data', 'file.txt')  # Windowsなら 'data\\file.txt'
    'data/file.txt'
    ```

  * **`sys`**: Pythonインタプリタ自体を制御するための機能を提供します。コマンドライン引数の取得や、Pythonの検索パスの確認などができます。

    ```python-repl
    >>> import sys
    >>> # Pythonのバージョンを表示
    >>> sys.version  # 環境により異なります
    '3.11.4 (main, Jun  7 2023, 10:13:09) [GCC 12.3.0]'
    ```

  * **`datetime`**: 日付や時刻を扱うための機能を提供します。

    ```python-repl
    >>> import datetime
    >>> # 現在の日時を取得 (実行時刻による)
    >>> now = datetime.datetime.now()
    >>> print(now)
    2025-08-12 18:26:06.123456
    >>> # 日時をフォーマットして文字列にする
    >>> now.strftime('%Y-%m-%d %H:%M:%S')
    '2025-08-12 18:26:06'
    ```

  * **`json`**: Web APIなどで広く使われているデータ形式であるJSONを扱うための機能を提供します。

    ```python-repl
    >>> import json
    >>> # Pythonの辞書型データ
    >>> user = {"id": 1, "name": "Ken", "email": "ken@example.com"}
    >>> # 辞書型をJSON形式の文字列に変換 (dumps: dump string)
    >>> json_string = json.dumps(user, indent=2)
    >>> print(json_string)
    {
      "id": 1,
      "name": "Ken",
      "email": "ken@example.com"
    }
    >>> # JSON形式の文字列をPythonの辞書型に変換 (loads: load string)
    >>> loaded_user = json.loads(json_string)
    >>> loaded_user['name']
    'Ken'
    ```

これらの他にも、正規表現を扱う `re`、乱数を生成する `random`、HTTPリクエストを送信する `urllib.request` など、数え切れないほどの便利なモジュールが標準で提供されています。何かを実装したいと思ったら、まずは「Python 標準ライブラリ 〇〇」で検索してみると、車輪の再発明を防ぐことができます。

## この章のまとめ

この章では、Pythonのコードが複雑になるにつれて重要性を増す、整理と再利用のテクニックを学びました。ここで学んだ概念は、小さなスクリプトから大規模なアプリケーションまで、あらゆるレベルのPythonプログラミングで役立ちます。

  * **モジュール**: 1つの `.py` ファイルは1つの**モジュール**です。関連する関数やクラスをモジュールにまとめることで、コードを論理的な単位に分割できます。他のファイルからは `import` 文を使ってその機能を再利用できます。
  * **パッケージ**: **パッケージ**は、複数のモジュールを階層的なディレクトリ構造で管理する仕組みです。これにより、大規模なプロジェクトでも名前の衝突を避け、関連するコードをまとめて整理することができます。
  * **標準ライブラリ**: Pythonには「**バッテリー同梱**」という思想があり、`datetime` (日時)、`os` (OS機能)、`json` (データ形式) など、すぐに使える便利なモジュールが豊富に揃っています。これらを活用することで、開発を大幅に効率化できます。

### 練習問題1: 計算モジュールを作ろう 🔢

四則演算を行うための自作モジュールを作成し、別のファイルから利用してみましょう。

1.  `calculator.py` というファイルを作成し、以下の4つの関数を定義してください。
      * `add(a, b)`: aとbの和を返す
      * `subtract(a, b)`: aとbの差を返す
      * `multiply(a, b)`: aとbの積を返す
      * `divide(a, b)`: aをbで割った商を返す。ただし、`b` が `0` の場合は「ゼロで割ることはできません」という文字列を返すようにしてください。
2.  `practice5-1.py` というファイルを作成し、作成した `calculator` モジュールをインポートします。
3.  `practice5-1.py` の中で、`calculator` モジュールの各関数を少なくとも1回ずつ呼び出し、結果を `print` 関数で表示してください。

```python:calculator.py
def add(a, b):
    
```

```python:practice5-1.py
```

```python-exec:practice5-1.py
(出力例)
10 + 5 = 15
10 - 5 = 5
10 * 5 = 50
10 / 2 = 5.0
10 / 0 = ゼロで割ることはできません
```

### 練習問題2：日報データをJSONで作成しよう 📝

標準ライブラリの `datetime` と `json` を使って、簡単な日報データを作成するプログラムを書いてみましょう。

1.  Pythonスクリプトを作成します。
2.  `datetime` モジュールを使って、**現在の日付**を `YYYY-MM-DD` 形式の文字列として取得します。
3.  以下の情報を含むPythonの辞書を作成します。
      * `author`: あなたの名前 (文字列)
      * `date`: 手順2で取得した日付文字列
      * `tasks`: その日に行ったタスクのリスト (例: `["会議", "資料作成", "メール返信"]`)
4.  `json` モジュールを使い、手順3で作成した辞書を人間が読みやすい形式 (インデント付き) のJSON文字列に変換します。
5.  変換後のJSON文字列を `print` 関数で表示してください。

**ヒント**: `datetime.datetime.now()` で現在時刻を取得し、`.strftime('%Y-%m-%d')` メソッドで日付をフォーマットできます。`json.dumps()` の `indent` 引数を指定すると、出力がきれになります。

```python:practice5-2.py
import datetime
import json
```

```python-exec:practice5-2.py
(出力例)
{
  "author": "山田 太郎",
  "date": "2025-08-17",
  "tasks": [
    "Pythonのモジュール学習",
    "練習問題の実装",
    "チームミーティング"
  ],
  "status": "完了"
}
```
