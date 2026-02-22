---
id: python-file-io-8-csv
title: CSVファイルの読み込み
level: 3
---

### CSVファイルの読み込み

**`csv.reader()`** を使ってリーダーオブジェクトを作成します。このオブジェクトをループで回すことで、1行ずつリストとしてデータを取得できます。

```python-repl:7
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
