---
id: javascript-objects-prototype-7-objectcreate
title: 1. Object.create()
level: 3
---

### 1\. Object.create()

指定したオブジェクトをプロトタイプとする新しい空のオブジェクトを生成します。

```js-repl:5
> const proto = { greet: function() { return "Hello"; } };
undefined
> const obj = Object.create(proto);
undefined
> obj.greet();
'Hello'
> Object.getPrototypeOf(obj) === proto
true
```
