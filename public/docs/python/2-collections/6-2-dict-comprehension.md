---
id: python-collections-dict-comprehension
title: 辞書内包表記
level: 3
---

### 辞書内包表記

```python-repl
>>> # 数値をキー、その2乗を値とする辞書を作成
>>> square_dict = {x: x*x for x in range(5)}
>>> square_dict
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```
