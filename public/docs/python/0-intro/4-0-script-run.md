---
id: python-intro-script-run
title: スクリプトの実行方法
level: 2
question:
  - なぜREPLではprint()なしで結果が表示され、スクリプトでは必要なのですか？
  - hello.pyのようなファイルはどのエディタで作成すれば良いですか？
  - python hello.py以外のスクリプト実行方法はありますか？
  - スクリプトを実行する際のターミナルの場所はどこでも良いのですか？
---

## スクリプトの実行方法

一連の処理をまとめて実行する場合は、`.py` という拡張子を持つファイルにコードを記述します。例えば、`hello.py` というファイルを以下のように作成します。
REPLでは式を入力するだけでも結果が表示されていましたが、スクリプトで結果を表示するには `print()` 関数を使う必要があります。

```python:hello.py
print("Hello from a Python script!")
```

このスクリプトを実行するには、ターミナルで `python hello.py` のようにコマンドを入力します。
このウェブサイト上の実行環境で動かす場合は、以下の実行ボタンをクリックしてください。

```python-exec:hello.py
Hello from a Python script!
```
