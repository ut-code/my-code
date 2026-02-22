---
id: python-modules-4-init-py
title: パッケージの概念と __init__.py
level: 3
---

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
