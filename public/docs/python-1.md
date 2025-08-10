# 第1章: Pythonへようこそ：環境構築と基本思想

プログラミング経験者にとって、新しい言語を学ぶ上で最も重要なことの一つは、その言語特有の「流儀」や設計思想を理解することです。この章では、Pythonの開発環境を構築し、Pythonがどのような考え方で作られているのかを探ります。

## Pythonのインストールとバージョン管理

Pythonを始めるには、まずお使いのコンピュータにPythonをインストールする必要があります。しかし、プロジェクトごとに異なるバージョンのPythonを使いたい場面は頻繁にあります。そこで、複数のPythonバージョンを簡単に切り替えて管理できる **`pyenv`** の利用を強く推奨します。

**`pyenv` とは？**
`pyenv` は、システム全体に影響を与えることなく、ユーザーのホームディレクトリ内で複数のPythonバージョンを管理できるツールです。これにより、「プロジェクトAではPython 3.9を、プロジェクトBではPython 3.11を使う」といったことが容易になります。

### インストール手順（macOS/Linuxの例）：
Homebrew（macOS）やgitを使って簡単にインストールできます。

1.  **pyenvのインストール:**

    ```bash
    # Homebrewの場合 (macOS)
    brew install pyenv
    ```

2.  **シェルの設定:**
    インストール後、以下のコマンドをシェルの設定ファイル（`.zshrc`, `.bash_profile`など）に追加します。

    ```bash
    eval "$(pyenv init --path)"
    eval "$(pyenv init -)"
    ```

3.  **Pythonのインストール:**
    利用可能なバージョンを確認し、特定のバージョンをインストールします。

    ```bash
    # インストール可能なバージョンの一覧を表示
    pyenv install --list

    # 例として Python 3.11.5 をインストール
    pyenv install 3.11.5
    ```

4.  **バージョンの切り替え:**
    `pyenv` を使うと、ディレクトリごと、またはグローバルに使用するPythonのバージョンを切り替えられます。

    ```bash
    # このディレクトリでは 3.11.5 を使う
    pyenv local 3.11.5

    # グローバルで 3.11.5 を使う
    pyenv global 3.11.5
    ```

Windowsユーザーの方は、`pyenv`のWindows版である **`pyenv-win`** を利用すると同様の環境を構築できます。


## 対話モード（REPL）の活用

Pythonには **REPL** (Read-Eval-Print Loop) と呼ばれる対話モードが備わっています。これは、コードを1行書くたびに即座に実行・評価し、結果を返してくれる機能です。他の言語での経験者にとっても、新しいライブラリの動作確認や、ちょっとした文法のテストに非常に便利です。

ターミナルで `python` と入力するだけで起動します。

```bash
$ python
Python 3.11.5 (main, Aug 24 2023, 15:09:47) [Clang 14.0.3 (clang-1403.0.22.14.1)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> message = "Hello, Python!"
>>> print(message)
Hello, Python!
>>> 1 + 2 * 3
7
>>> exit()
```

より高機能なREPLとして **IPython** や **Jupyter Notebook** も人気があります。これらはコード補完や履歴管理、インラインでのグラフ描画など、さらに強力な機能を備えています。


## スクリプトの実行方法

一連の処理をまとめて実行する場合は、`.py` という拡張子を持つファイルにコードを記述します。例えば、`hello.py` というファイルを以下のように作成します。

**hello.py**

```python:hello.py
def main():
    print("Hello from a Python script!")

if __name__ == "__main__":
    main()
```

`if __name__ == "__main__":` は、このスクリプトが直接実行された場合にのみ `main()` 関数を呼び出すためのお決まりの書き方です。他のスクリプトからモジュールとしてインポートされた際には `main()` は実行されません。

このスクリプトを実行するには、ターミナルで以下のようにコマンドを入力します。

```bash
python hello.py
```

出力結果:

```
Hello from a Python script!
```


## Pythonの禅 (The Zen of Python)

Pythonには、その設計哲学を端的に表した **「The Zen of Python」** という短い詩のような文章があります。これはPythonの思想を理解する上で非常に重要です。対話モードで `import this` と入力すると表示されます。

```python-repl
>>> import this
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
...
```

「美しいは醜いより良い」「明示的は暗黙的より良い」「シンプルは複雑より良い」といった言葉は、Pythonでコードを書く上での指針となります。Pythonらしいコードとは、**読みやすく、シンプルで、意図が明確なコード**であると言えます。

## パッケージ管理ツール `pip` と仮想環境 `venv`

Pythonの強力なエコシステムは、豊富なサードパーティ製パッケージ（ライブラリ）によって支えられています。これらのパッケージを管理するのが **`pip`** です。

**`pip`** はPythonの標準パッケージインストーラで、例えばデータ分析で人気の `pandas` をインストールするには、以下のコマンドを実行します。

```bash
pip install pandas
```

しかし、プロジェクトAでは `pandas` のバージョン1.0が必要で、プロジェクトBでは2.0が必要、といった依存関係の衝突が起こる可能性があります。これを解決するのが **仮想環境** です。

**`venv`** は、プロジェクトごとに独立したPython環境を作成するための標準モジュールです。仮想環境を有効にすると、`pip` でインストールしたパッケージはその環境内にのみ保存され、他のプロジェクトやシステムのPython環境を汚染しません。

**仮想環境の作成と利用:**

1.  **作成:** プロジェクトディレクトリで以下のコマンドを実行します。（`.venv` は仮想環境を保存するディレクトリ名で、慣例的によく使われます）

    ```bash
    python -m venv .venv
    ```

2.  **有効化 (Activate):**

    ```bash
    # macOS / Linux
    source .venv/bin/activate

    # Windows (Command Prompt)
    .\.venv\Scripts\activate
    ```

    有効化すると、プロンプトの先頭に `(.venv)` のような表示が追加され、このターミナルセッションでは仮想環境が使われていることが分かります。

3.  **パッケージのインストール:**
    この状態で `pip install` を実行すると、パッケージは `.venv` ディレクトリ内にインストールされます。

    ```bash
    (.venv) $ pip install requests
    ```

4.  **無効化 (Deactivate):**
    仮想環境から抜けるには `deactivate` コマンドを使います。

    ```bash
    (.venv) $ deactivate
    ```

`pyenv` でPythonのバージョンを管理し、`venv` でプロジェクトごとのパッケージを管理する。この2つを組み合わせることが、現代的なPython開発の基本スタイルです。