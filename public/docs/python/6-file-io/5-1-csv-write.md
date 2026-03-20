---
id: python-file-io-csv-write
title: CSVファイルへの書き込み
level: 3
question:
  - '`newline=''''` を指定しない場合、「不要な空行」は具体的にどのように発生してしまうのですか？'
  - '`writerow()` と `writerows()` は、それぞれどのような状況で使い分けるのが良いですか？'
  - '`data_to_write` がリストのリストではなく、辞書のリストのような形式の場合でもCSVに書き込めますか？'
---

### CSVファイルへの書き込み

**`csv.writer()`** を使ってライターオブジェクトを作成し、**`writerow()`** (1行) や **`writerows()`** (複数行) メソッドでデータを書き込みます。

```python-repl
>>> import csv

>>> # 書き込むデータ（リストのリスト）
>>> data_to_write = [
...     ["ID", "Name", "Score"],
...     [1, "Alice", 95],
...     [2, "Bob", 88],
...     [3, "Charlie", 76]
... ]

>>> # newline='' はWindowsでの不要な空行を防ぐためのおまじない
>>> with open('scores.csv', 'w', newline='', encoding='utf-8') as f:
...     writer = csv.writer(f)
...     writer.writerows(data_to_write)
... 
```

```csv-readonly:scores.csv
ID,Name,Score
1,Alice,95
2,Bob,88
3,Charlie,76
```
