---
id: python-file-io-csv-read
title: CSVファイルの読み込み
level: 3
question:
  - '`csv.reader()` がすべてのデータを文字列として読み込むのはなぜですか？読み込み時に自動で数値型などに変換する方法はありませんか？'
  - '`csv.reader` オブジェクトを `for` ループで回す以外の方法で、すべての行を一度にリストとして取得する方法はありますか？'
  - 'カンマ以外の文字（例: タブやセミコロン）で区切られたCSVファイルを読み込むことはできますか？'
---

### CSVファイルの読み込み

**`csv.reader()`** を使ってリーダーオブジェクトを作成します。このオブジェクトをループで回すことで、1行ずつリストとしてデータを取得できます。

```python-repl
>>> import csv

>>> with open('scores.csv', 'r', newline='', encoding='-utf-8') as f:
...     reader = csv.reader(f)
...     # リーダーオブジェクトはイテレータなのでforループで回せる
...     for row in reader:
...         print(row)
... 
['ID', 'Name', 'Score']
['1', 'Alice', '95']
['2', 'Bob', '88']
['3', 'Charlie', '76']
```

注意点として、`csv`モジュールはすべてのデータを文字列として読み込みます。数値として扱いたい場合は、自分で `int()` や `float()` を使って型変換する必要があります。
