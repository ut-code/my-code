---
id: python-file-io-7-csv
title: CSVファイルへの書き込み
level: 3
---

### CSVファイルへの書き込み

**`csv.writer()`** を使ってライターオブジェクトを作成し、**`writerow()`** (1行) や **`writerows()`** (複数行) メソッドでデータを書き込みます。

```python-repl:6
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
