# 第5章: コードの整理術：モジュールとパッケージ

プログラミングを進めていくと、コードは必然的に長くなり、一つのファイルで管理するのが難しくなってきます。機能ごとにファイルを分割し、再利用しやすく、メンテナンスしやすい構造にすることが、効率的な開発の鍵となります。この章では、Pythonでコードを整理するための**モジュール**と**パッケージ**という仕組み、そしてPythonの強力な武器である**標準ライブラリ**の活用方法について学びます。


## REPLからスクリプトファイルへ

これまでの章では、コマンドを1行ずつ入力してすぐに結果が返ってくる**REPL (対話型実行環境)** を使ってきました。REPLは、ちょっとしたコードの動作確認や学習には非常に便利です。しかし、REPLを終了すると入力したコードは消えてしまいますし、複雑なプログラムを作るのにも向いていません。

実際の開発では、プログラムを**スクリプトファイル**に保存して実行するのが一般的です。

### Pythonファイルの作成と実行

1.  **ファイルの作成**:
    お使いのテキストエディタ（VS Code、サクラエディタ、メモ帳など何でも構いません）を開き、以下のコードを記述してください。そして、`hello.py` という名前で保存します。ファイルの拡張子は必ず `.py` にしてください。

    ```python:hello.py
    message = "Hello, Python Script!"
    print(message)
    print(f"2 + 3 = {2 + 3}")
    ```

2.  **ファイルの実行**:
    次に、ターミナル（WindowsではコマンドプロンプトやPowerShell）を開き、`cd` コマンドで `hello.py` を保存したディレクトリに移動します。そして、以下のコマンドを実行してください。

    ```bash
    # python3コマンドの場合もあります
    python hello.py
    ```

    すると、画面に以下のように出力されるはずです。

    ```
    Hello, Python Script!
    2 + 3 = 5
    ```

このように、`python [ファイル名]` というコマンドで、ファイルに書かれたコードを上から順に実行することができます。これからは、このファイルベースでの開発を基本として進めていきましょう。


## モジュール：コードを部品化する

さて、ここからが本題です。Pythonでは、先ほど作成した **`hello.py` のような `.py` ファイルが1つのモジュール**として扱われます。モジュールを使うことで、関連する関数やクラスを一つのファイルにまとめ、他のプログラムから再利用可能な「部品」として扱うことができます。これは、他の言語におけるライブラリやソースファイルのインポート機能に似ています。

### `import`文の基本

モジュールを利用するには `import` 文を使います。Pythonには多くの便利なモジュールが標準で用意されています（これらを**標準ライブラリ**と呼びます）。例えば、数学的な計算を行う `math` モジュールをREPLで使ってみましょう。

```python-repl
>>> # mathモジュールをインポート
>>> import math
>>>
>>> # mathモジュール内の変数や関数を利用する
>>> print(math.pi)
3.141592653589793
>>> print(math.sqrt(16))
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
    print(greeting) # => Hello, Alice!

    scores = [88, 92, 75, 100]
    average_score = utils.get_list_average(scores)
    print(f"Your average score is: {average_score}") # => Your average score is: 88.75
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

```python:main.py

# パッケージ内のモジュールをインポート
from my_app import services

# servicesモジュール内の関数を実行 (仮の関数)
# user_data = services.fetch_user_data(user_id=123)
# print(user_data)
```

`__init__.py` には、パッケージがインポートされた際の初期化処理を記述することもできます。


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
... (ヘルプ情報が続く) ...
```

### よく使われる標準ライブラリの例

ここでは、日常的によく使われる標準ライブラリをいくつかREPLで試してみましょう。

  * **`os`**: OSとの対話。ファイルやディレクトリの操作など。

    ```python-repl
    >>> import os
    >>>
    >>> # カレントディレクトリのファイル一覧を取得
    >>> os.listdir('.')
    ['hello.py', 'utils.py', 'main.py']
    >>>
    >>> # OSに依存しない安全なパスの結合
    >>> os.path.join('data', 'file.txt')
    'data/file.txt' # Mac/Linuxの場合
    # 'data\\file.txt' # Windowsの場合
    ```

  * **`sys`**: Pythonインタプリタに関する情報。コマンドライン引数など。

    ```python-repl
    >>> import sys
    >>>
    >>> # Pythonのバージョンを表示
    >>> sys.version
    '3.11.4 (main, Jun  7 2023, 10:13:09) [GCC 12.3.0]' # 環境により異なります
    ```

    ( `sys.argv` はスクリプト実行時に意味を持つため、ここでは割愛します )

  * **`datetime`**: 日付や時刻の操作。

    ```python-repl
    >>> import datetime
    >>>
    >>> # 現在の日時を取得
    >>> now = datetime.datetime.now()
    >>> print(now)
    2025-08-12 18:26:06.123456 # 実行時刻による
    >>>
    >>> # 日時をフォーマットして文字列にする
    >>> now.strftime('%Y-%m-%d %H:%M:%S')
    '2025-08-12 18:26:06'
    ```

  * **`json`**: JSON形式のデータの操作。

    ```python-repl
    >>> import json
    >>>
    >>> # Pythonの辞書型データ
    >>> user = {"id": 1, "name": "Ken", "email": "ken@example.com"}
    >>>
    >>> # 辞書型をJSON形式の文字列に変換 (dumps: dump string)
    >>> json_string = json.dumps(user, indent=2)
    >>> print(json_string)
    {
      "id": 1,
      "name": "Ken",
      "email": "ken@example.com"
    }
    >>>
    >>> # JSON形式の文字列をPythonの辞書型に変換 (loads: load string)
    >>> loaded_user = json.loads(json_string)
    >>> loaded_user['name']
    'Ken'
    ```

これらの他にも、正規表現を扱う `re`、乱数を生成する `random` など、数え切れないほどの便利なモジュールが標準で提供されています。何かを実装したいと思ったら、まずは「Python 標準ライブラリ 〇〇」で検索してみると、車輪の再発明を防ぐことができます。


## まとめ

この章では、Pythonにおけるコードの整理術を学びました。

  * **スクリプトファイル (`.py`)** にコードを保存し、`python` コマンドで実行するのが開発の基本です。
  * **モジュール**は `.py` ファイル単位のコードの部品であり、`import` 文で再利用します。
  * **パッケージ**はモジュールをまとめるディレクトリであり、大規模なプロジェクトの構造を整理します。
  * **`if __name__ == "__main__":`** は、モジュールが直接実行されたか、インポートされたかを判別するための重要な構文です。
  * Pythonには強力な**標準ライブラリ**が多数同梱されており、多くの一般的なタスクはこれらを活用することで効率的に実装できます。

コードを適切にモジュール化・パッケージ化することは、読みやすく、テストしやすく、再利用しやすい、質の高いソフトウェアを開発するための第一歩です。