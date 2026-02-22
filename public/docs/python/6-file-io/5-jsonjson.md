---
id: python-file-io-5-jsonjson
title: jsonモジュールを使ったJSONの操作
level: 2
---

## `json`モジュールを使ったJSONの操作

**JSON (JavaScript Object Notation)** は、データ交換フォーマットとして広く使われています。Pythonの標準ライブラリである **`json`** モジュールを使うと、Pythonのオブジェクト（辞書やリストなど）をJSON形式のデータに、またはその逆に変換できます。

  * **`json.dump(obj, fp)`**: Pythonオブジェクト `obj` をJSON形式でファイルオブジェクト `fp` に書き込みます。
  * **`json.load(fp)`**: JSON形式のファイルオブジェクト `fp` からデータを読み込み、Pythonオブジェクトに変換します。

<!-- end list -->

```python-repl:5
>>> import json

>>> # 書き込むデータ（Pythonの辞書）
>>> data = {
...     "name": "Taro Yamada",
...     "age": 30,
...     "is_student": False,
...     "courses": ["Python", "Machine Learning"]
... }

>>> # with文を使ってJSONファイルに書き込む
>>> with open('user.json', 'w', encoding='utf-8') as f:
...     # ensure_ascii=Falseで日本語をそのまま出力
...     json.dump(data, f, indent=4, ensure_ascii=False)
... 

>>> # JSONファイルから読み込む
>>> with open('user.json', 'r', encoding='utf-8') as f:
...     loaded_data = json.load(f)
... 
>>> loaded_data
{'name': 'Taro Yamada', 'age': 30, 'is_student': False, 'courses': ['Python', 'Machine Learning']}
>>> loaded_data['name']
'Taro Yamada'
```

`json.dump()` の `indent=4` は、人間が読みやすいように4スペースのインデントを付けて出力するオプションです。`ensure_ascii=False` は、日本語などの非ASCII文字をそのままの文字で出力するために指定します。

```json-readonly:user.json
{
    "name": "Taro Yamada",
    "age": 30,
    "is_student": false,
    "courses": [
        "Python",
        "Machine Learning"
    ]
}
```
