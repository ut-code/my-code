---
id: python-basics-2-int-float
title: 数値（int, float）
level: 3
---

### 数値（int, float）

Pythonは整数 (`int`) と浮動小数点数 (`float`) を区別します。

```python-repl:3
>>> # 整数 (int)
>>> a = 10
>>> type(a)
<class 'int'>
>>> # 浮動小数点数 (float)
>>> b = 3.14
>>> type(b)
<class 'float'>
```

四則演算は直感的に行えます。注意点として、除算 (`/`) は常に `float` を返します。整数除算を行いたい場合は (`//`) を使います。

```python-repl:4
>>> 10 / 3
3.3333333333333335
>>> 10 // 3
3
>>> # べき乗
>>> 2 ** 4
16
>>> # 剰余
>>> 10 % 3
1
```
