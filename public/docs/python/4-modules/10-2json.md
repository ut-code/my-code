---
id: python-modules-10-2json
title: 練習問題2：日報データをJSONで作成しよう 📝
level: 3
---

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

```python:practice5_2.py
import datetime
import json
```

```python-exec:practice5_2.py
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
