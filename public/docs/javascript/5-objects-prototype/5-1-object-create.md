---
id: javascript-prototype-object-create
title: 1. Object.create()
level: 3
question:
  - '`Object.create()` はどんな時に使うのが適切ですか？'
  - '`const obj = {};` と `const obj = Object.create(proto);` は何が違うのですか？'
---

### 1\. Object.create()

指定したオブジェクトをプロトタイプとする新しい空のオブジェクトを生成します。

```js-repl
> const proto = { greet: function() { return "Hello"; } };
undefined
> const obj = Object.create(proto);
undefined
> obj.greet();
'Hello'
> Object.getPrototypeOf(obj) === proto
true
```
