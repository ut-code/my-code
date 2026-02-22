---
id: python-collections-0-list
title: リスト (List)：ミュータブルなシーケンス
level: 2
---

## リスト (List)：ミュータブルなシーケンス

リストは、複数の要素を順序付けて格納できるコレクションです。他の言語における「動的配列」に最も近い存在です。

  * **ミュータブル (Mutable)**: 作成後に要素の追加、変更、削除が可能です。
  * **順序あり (Ordered)**: 要素は格納された順序を保持します。
  * **多様な要素**: 数値、文字列、さらには他のリストなど、異なるデータ型の要素を混在させることができます。

**基本的な使い方 (REPL実行例)**

```python-repl:1
>>> # リストの作成
>>> fruits = ['apple', 'banana', 'cherry']
>>> fruits
['apple', 'banana', 'cherry']

>>> # 要素へのアクセス (インデックスは0から)
>>> fruits[1]
'banana'

>>> # 要素の変更
>>> fruits[0] = 'apricot'
>>> fruits
['apricot', 'banana', 'cherry']

>>> # 要素の追加 (末尾に)
>>> fruits.append('mango')
>>> fruits
['apricot', 'banana', 'cherry', 'mango']

>>> # 要素の削除 (指定したインデックス)
>>> removed_fruit = fruits.pop(1)
>>> removed_fruit
'banana'
>>> fruits
['apricot', 'cherry', 'mango']
```

リストは非常に柔軟性が高く、Pythonで最も頻繁に使われるデータ構造の一つです。
