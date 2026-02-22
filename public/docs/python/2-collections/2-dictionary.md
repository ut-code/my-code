---
id: python-collections-2-dictionary
title: 辞書 (Dictionary)：キーと値のペア
level: 2
---

## 辞書 (Dictionary)：キーと値のペア

辞書は、他の言語の**ハッシュマップ**や**連想配列**に相当します。順序ではなく、一意な「キー」を使って「値」にアクセスします。

  * **キーと値のペア**: `key: value` の形式でデータを格納します。
  * **一意なキー**: キーは辞書内で重複してはいけません。
  * **順序**: Python 3.7以降では、要素が追加された順序が保持されます。
  * **ミュータブル**: 要素の追加、変更、削除が可能です。

**基本的な使い方 (REPL実行例)**

```python-repl:3
>>> # 辞書の作成
>>> person = {'name': 'Taro Yamada', 'age': 30, 'city': 'Tokyo'}
>>> person
{'name': 'Taro Yamada', 'age': 30, 'city': 'Tokyo'}

>>> # 値へのアクセス (キーを使用)
>>> person['name']
'Taro Yamada'

>>> # 値の変更
>>> person['age'] = 31
>>> person['age']
31

>>> # 新しいキーと値のペアの追加
>>> person['job'] = 'Engineer'
>>> person
{'name': 'Taro Yamada', 'age': 31, 'city': 'Tokyo', 'job': 'Engineer'}

>>> # キーと値のペアをまとめて取得
>>> person.items()
dict_items([('name', 'Taro Yamada'), ('age', 31), ('city', 'Tokyo'), ('job', 'Engineer')])
```
