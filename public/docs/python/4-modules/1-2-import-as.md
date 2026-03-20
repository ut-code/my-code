---
id: python-modules-import-as
title: 'import...as: モジュールに別名をつけて利用する'
level: 4
question:
  - '`import math as m`とすると何が変わるのですか？'
  - '`as`を使ってモジュールに別名をつけるのはどのような時ですか？'
  - 短い別名を使うことのメリットとデメリットは何ですか？
---

#### `import...as`: モジュールに別名をつけて利用する

```python-repl
>>> import math as m
>>>
>>> print(m.pi)
3.141592653589793
>>> print(m.sqrt(16))
4.0
```
