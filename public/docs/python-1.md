# 第1章: Pythonへようこそ：環境構築と基本

プログラミング経験者であっても、言語ごとのツールや流儀を最初に理解することは重要です。この章では、Pythonの開発環境を整え、基本的なツールの使い方を学びます。

## Pythonのインストール方法

手元の環境で本格的に開発を進めるために、Pythonのインストール方法を紹介します。

### Windows

WindowsでPythonをインストールするには、主に2つの方法があります。

1.  **[Python公式インストーラ](https://www.python.org/downloads/)**: Pythonの公式サイトからインストーラをダウンロードする方法が最も一般的です。インストール時に「Add Python to PATH」のチェックを入れると、コマンドプロンプトやPowerShellから `python` コマンドを直接実行できるようになり便利です。
2.  **Microsoft Store**: Microsoft Storeからも手軽にPythonをインストールできます。

### macOS / Linux

macOSでは、**Homebrew** というパッケージマネージャを使ってインストールするのが簡単です。
`brew install python`

もちろん、Windowsと同様に公式サイトからインストーラをダウンロードすることも可能です。多くのLinuxディストリビューションには初めからPythonがインストールされていますが、最新版を使いたい場合はディストリビューションのパッケージマネージャ（`apt`, `yum`など）を利用するのが一般的です。

### バージョン管理と環境管理ツール

より高度な開発や、複数のプロジェクトを並行して進める場合は、バージョン管理ツールや統合的な環境管理ツールの利用が推奨されます。

  * **[pyenv](https://github.com/pyenv/pyenv)**: 複数のPythonバージョン（例: 3.9と3.11）を一つのPCに共存させ、プロジェクトごとに切り替えるためのツールです。
  * **[Conda](https://docs.conda.io/en/latest/)**: 特にデータサイエンスの分野で人気のあるツールです。**Conda** はPythonのバージョン管理だけでなく、パッケージ管理、仮想環境の管理までを一つでこなせるオールインワンのソリューションです。

## 対話モード（REPL）でPythonを体験しよう

**REPL**（Read-Eval-Print Loop）は、入力したコードをその場で実行し、結果をすぐに見ることができる強力な学習・デバッグツールです。

### ブラウザで今すぐ試す

このウェブサイトではドキュメント内に Python {process.env.PYODIDE_PYTHON_VERSION} の実行環境を埋め込んでいます。
以下のように青枠で囲われたコード例には自由にPythonコードを書いて試すことができます。気軽に利用してください。

```python-repl
>>> message = "Hello, Python!"
>>> print(message)
Hello, Python!
>>> 1 + 2 * 3
7
```

### 自分のPCで使う

インストールが完了したら、自分のPCのターミナル（コマンドプロンプトやPowerShellなど）で `python` と入力すれば、同じ対話モードを起動できます。

```
$ python
Python 3.11.5 (...)
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

`>>>` というプロンプトが表示されたら準備完了です。

### REPL の基本的な使い方

* **計算:** 数式を直接入力すると、計算結果が返ってきます。
```python-repl
>>> 10 * 5 + 3
53
```
* **変数と関数の利用:** 変数を定義したり、`print()`のような組み込み関数を呼び出したりできます。
```python-repl
>>> greeting = "Hi there"
>>> print(greeting)
Hi there
```
* **ヘルプ機能:** `help()` と入力するとヘルプが表示されます。調べたいモジュールや関数名（例: `str`）を入力するとドキュメントが表示されます。
    * PCのターミナルで起動したREPLでは、対話的なヘルプモードが起動します。ヘルプモードを抜けるには `quit` と入力します。
```python-repl
>>> help(str)
Help on class str in module builtins:

class str(object)
 |  str(object='') -> str
 |  str(bytes_or_buffer[, encoding[, errors]]) -> str
 | ...
```
* **終了方法:** REPLを終了するには、`exit()` と入力するか、ショートカットキー（macOS/Linuxでは `Ctrl + D`、Windowsでは `Ctrl + Z` を押してからEnter）を使用します。
    * このウェブサイトに埋め込まれているREPLは、終了できません。

## スクリプトの実行方法

一連の処理をまとめて実行する場合は、`.py` という拡張子を持つファイルにコードを記述します。例えば、`hello.py` というファイルを以下のように作成します。
REPLでは式を入力するだけでも結果が表示されていましたが、スクリプトで結果を表示するには `print()` 関数を使う必要があります。

```python:hello.py
print("Hello from a Python script!")
```

このスクリプトを実行するには、ターミナルで `python hello.py` のようにコマンドを入力します。

このウェブサイト上では以下のように実行ボタンをクリックするとスクリプトの実行結果が表示されます。上の hello1.py のコードを変更して再度実行すると結果も変わるはずです。試してみてください。

```python-exec:hello.py
Hello from a Python script!
```

### __main__ について

前述の hello.py のようにファイルの1行目から処理を書いても問題なく動作しますが、一般的には以下のようなお決まりの書き方が用いられます。

```python:hello2.py
def main():
    print("Hello from a Python script!")

if __name__ == "__main__":
    main()
```

```python-exec:hello2.py
Hello from a Python script!
```

なぜわざわざ `if __name__ == "__main__":` を使うのでしょうか？
それは、**書いたコードを「スクリプトとして直接実行する」場合と、「他のファイルから部品（モジュール）として読み込んで使う」場合の両方に対応できるようにするため**です。

Pythonでは、ファイルは他のファイルから `import` 文で読み込むことができます。このとき、読み込まれたファイル（モジュール）は上から順に実行されます。

`if __name__ == "__main__":` を使うと、**「このファイルがコマンドラインから直接 `python a.py` のように実行された時だけ、このブロックの中の処理を実行してね」** という意味になります。

**例：再利用可能な関数を持つスクリプト**

```python:my_utils.py
def say_hello(name):
    """挨拶を返す関数"""
    return f"Hello, {name}!"

# このファイルが直接実行された時だけ、以下のテストコードを実行する
if __name__ == "__main__":
    print("--- Running Test ---")
    message = say_hello("Alice")
    print(message)
    print("--- Test Finished ---")
```

このファイルを2通りの方法で使ってみます。

1.  **直接スクリプトとして実行する**

    ```python-exec:my_utils.py
    --- Running Test ---
    Hello, Alice!
    --- Test Finished ---
    ```

2.  **他のファイルからモジュールとして読み込む**

    ```python:main_app.py
    # my_utils.py から say_hello 関数だけを読み込む
    from my_utils import say_hello

    print("--- Running Main App ---")
    greeting = say_hello("Bob")
    print(greeting)
    ```

    ```python-exec:main_app.py
    --- Running Main App ---
    Hello, Bob!
    ```

    `my_utils.py` のテストコード（`--- Running Test ---`など）は実行されず、`say_hello` 関数だけを部品として利用できました。

このように、`if __name__ == "__main__":` は、**再利用可能な関数やクラスの定義**と、**そのファイル単体で動かすための処理**をきれいに分離するための、Pythonにおける非常に重要な作法です。

## パッケージ管理ツール `pip` と仮想環境 `venv`

Pythonの強力なエコシステムは、豊富なサードパーティ製パッケージ（ライブラリ）によって支えられています。これらのパッケージを管理するのが **`pip`** です。

しかし、プロジェクトごとに異なるバージョンのパッケージを使いたい場合、依存関係の衝突が問題になります。これを解決するのが **仮想環境** で、Pythonでは **`venv`** モジュールを使って作成するのが標準的です。

**仮想環境とは？** 🚧
プロジェクト専用の独立したPython実行環境です。ここでインストールしたパッケージはシステム全体には影響を与えず、そのプロジェクト内に限定されます。

**基本的な流れ:**

1.  **仮想環境の作成**:

    ```bash
    # .venvという名前の仮想環境を作成
    python -m venv .venv
    ```

2.  **仮想環境の有効化（Activate）**:

    ```bash
    # macOS / Linux
    source .venv/bin/activate

    # Windows (PowerShell)
    .\.venv\Scripts\Activate.ps1
    ```

    有効化すると、ターミナルのプロンプトに `(.venv)` のような表示が付きます。

3.  **パッケージのインストール**:
    有効化された環境で `pip` を使ってパッケージをインストールします。

    ```bash
    (.venv) $ pip install requests
    ```

4.  **仮想環境の無効化（Deactivate）**:

    ```bash
    (.venv) $ deactivate
    ```

**`pyenv` でPythonバージョンを固定し、`venv` でプロジェクトのパッケージを隔離する** のが、現代的なPython開発の基本スタイルです。（前述の **Conda** は、このPythonバージョン管理と環境・パッケージ管理を両方とも行うことができます。）