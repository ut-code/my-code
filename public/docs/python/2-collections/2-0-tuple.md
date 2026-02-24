---
id: python-collections-tuple
title: タプル (Tuple)：イミュータブルなシーケンス
level: 2
---

## タプル (Tuple)：イミュータブルなシーケンス

タプルはリストと非常によく似ていますが、最大の違いは**イミュータブル (Immutable)**、つまり一度作成したら変更できない点です。

  * **イミュータブル (Immutable)**: 要素の変更、追加、削除はできません。
  * **順序あり (Ordered)**: リスト同様、順序を保持します。

**なぜタプルを使うのか？** 🤔

1.  **安全なデータ**: 変更されたくないデータを安全に保持できます（例: 関数の引数、定数セット）。
2.  **パフォーマンス**: 一般的にリストよりわずかに高速で、メモリ効率が良いとされています。
3.  **辞書のキーとして使用可能**: ミュータブルなリストは辞書のキーになれませんが、イミュータブルなタプルはキーとして使えます。

**基本的な使い方 (REPL実行例)**

```python-repl
>>> # タプルの作成 (丸括弧を使用)
>>> coordinates = (10, 20)
>>> coordinates
(10, 20)

>>> # 要素へのアクセス
>>> coordinates[0]
10

>>> # 変更しようとするとエラーが発生する
>>> coordinates[0] = 5
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment

>>> # アンパッキング (複数の変数に要素を一度に代入)
>>> x, y = coordinates
>>> x
10
>>> y
20
```
