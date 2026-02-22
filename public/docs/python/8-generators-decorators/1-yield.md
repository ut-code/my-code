---
id: python-generators-decorators-1-yield
title: ジェネレータ関数とyieldキーワード
level: 2
---

## ジェネレータ関数とyieldキーワード

イテレータを自作するには、クラスに `__iter__()` と `__next__()` を実装する必要がありますが、少し手間がかかります。そこで登場するのが**ジェネレータ**です。ジェネレータは、イテレータを簡単に作成するための特別な関数です。

ジェネレータ関数は、通常の関数と似ていますが、値を返すのに`return`の代わりに`yield`を使います。

  * **`yield`の働き**: `yield`は値を返すだけでなく、その時点で関数の実行を**一時停止**し、関数の状態（ローカル変数など）を保存します。次に`next()`が呼ばれると、停止した場所から処理を再開します。

これにより、巨大なデータセットを扱う際に、全てのデータを一度にメモリに読み込む必要がなくなります。必要な時に必要な分だけデータを生成するため、非常にメモリ効率が良いコードが書けます。

フィボナッチ数列を生成するジェネレータの例を見てみましょう。

```python-repl:2
>>> def fib_generator(n):
...     a, b = 0, 1
...     count = 0
...     while count < n:
...         yield a
...         a, b = b, a + b
...         count += 1
...
>>> f = fib_generator(5)
>>> type(f)
<class 'generator'>

>>> next(f)
0
>>> next(f)
1
>>> next(f)
1
>>> next(f)
2
>>> next(f)
3
>>> next(f)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration

# ジェネレータはもちろんforループで使うことができます
>>> for num in fib_generator(8):
...     print(num, end=' ')
...
0 1 1 2 3 5 8 13
```
