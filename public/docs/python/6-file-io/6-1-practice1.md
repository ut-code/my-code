---
id: python-file-io-practice1
title: '練習問題1: ユーザー情報の書き出しと読み込み'
level: 3
question:
  - 練習問題の `email` アドレスの `@` が全角になっていますが、これは意図的ですか？半角にしても問題ないですか？
  - '`json.dump()` の `indent` オプションを付け忘れた場合、出力されるJSONファイルはどのように表示されますか？'
---

### 練習問題1: ユーザー情報の書き出しと読み込み

1.  以下の情報を持つユーザーのデータを、Pythonの辞書として作成してください。
      * `id`: 101
      * `name`: "Sato Kenji"
      * `email`: "kenji.sato＠example.com"
2.  この辞書を、`with` 文と `json` モジュールを使って `user_profile.json` という名前のファイルに書き出してください。その際、人間が読みやすいようにインデントを付けてください。
3.  書き出した `user_profile.json` ファイルを読み込み、内容をコンソールに表示してください。

```python:practice7_1.py
```

```python-exec:practice7_1.py
(出力例) {'id': 101, 'name': 'Sato Kenji', 'email': 'kenji.sato@example.com'}
```

```json-readonly:user_profile.json
```
