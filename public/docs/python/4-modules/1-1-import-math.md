---
id: python-modules-import-math
title: import文の基本
level: 3
---

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

毎回 `math.` と書くのが面倒な場合は、いくつかの書き方があります。
