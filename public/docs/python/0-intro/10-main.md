---
id: python-intro-10-main
title: __main__ について
level: 3
---

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
