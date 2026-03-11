---
id: python-modules-from-import
title: 'from...import: モジュールから特定の関数や変数だけを取り込む'
level: 4
question:
  - '`from math import pi, sqrt`と`import math`はどのように違うのですか？'
  - '`pi`や`sqrt`を直接参照できるメリットは何ですか？'
  - '`from math import *`はなぜ避けるべきなのですか？'
  - 「名前空間」とは具体的に何のことですか？
  - 「意図しない名前の上書き」とはどういうことですか？
---

#### `from...import`: モジュールから特定の関数や変数だけを取り込む

```python-repl
>>> from math import pi, sqrt
>>>
>>> print(pi)       # 直接piを参照できる
3.141592653589793
>>> print(sqrt(16)) # 直接sqrtを参照できる
4.0
```

> **注意** ⚠️: `from math import *` のようにアスタリスク (`*`) を使うと、そのモジュールのすべての名前（関数、変数、クラス）が現在の名前空間にインポートされます。一見便利に見えますが、どの名前がどこから来たのか分からなくなり、意図しない名前の上書きを引き起こす可能性があるため、**特別な理由がない限り避けるべき**です。
