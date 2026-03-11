---
id: python-collections-set-comprehension
title: セット内包表記
level: 3
question:
  - セット内包表記は、リスト内包表記と何が一番違うのですか？
  - セット内包表記で、重複した要素の2乗も全て表示させたい場合はどうすれば良いですか？
---

### セット内包表記

```python-repl
>>> # リスト内のユニークな数値の2乗のセットを作成
>>> numbers = [1, 2, 2, 3, 4, 4, 5]
>>> square_set = {x*x for x in numbers}
>>> square_set
{1, 4, 9, 16, 25}
```
