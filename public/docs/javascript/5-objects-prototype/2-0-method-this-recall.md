---
id: javascript-objects-method-this-recall
title: メソッドと this（復習）
level: 2
---

## メソッドと this（復習）

オブジェクトのプロパティには関数も設定できます。これを**メソッド**と呼びます。
第5章で学んだ通り、メソッド呼び出しにおける `this` は、「ドットの左側にあるオブジェクト（レシーバ）」を指します。

```js-repl
> const counter = {
...   count: 0,
...   increment: function() {
...     this.count++;
...     return this.count;
...   },
...   // ES6からの短縮記法（推奨）
...   reset() {
...     this.count = 0;
...   }
... };
undefined
> counter.increment();
1
> counter.increment();
2
> counter.reset();
undefined
> counter.count
0
```
