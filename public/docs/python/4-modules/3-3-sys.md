---
id: python-modules-sys
title: sys
level: 3
question:
  - '`sys`モジュールはどんなときに使うと便利ですか？'
  - '`sys.version`はどのような情報を示していますか？'
  - コマンドライン引数の取得とは、具体的にどういうことですか？
---

### `sys`

Pythonインタプリタ自体を制御するための機能を提供します。コマンドライン引数の取得や、Pythonの検索パスの確認などができます。

```python-repl
>>> import sys
>>> # Pythonのバージョンを表示
>>> sys.version  # 環境により異なります
'3.11.4 (main, Jun  7 2023, 10:13:09) [GCC 12.3.0]'
```

