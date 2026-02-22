---
id: javascript-objects-prototype-4-proto-objectgetproto
title: __proto__ と Object.getPrototypeOf
level: 3
---

### `__proto__` と `Object.getPrototypeOf`

歴史的経緯により、多くのブラウザで `obj.__proto__` というプロパティを通じてプロトタイプにアクセスできますが、現在の標準的な方法は `Object.getPrototypeOf(obj)` です。

```js-repl:4
> const arr = [1, 2, 3];
undefined
> // 配列の実体はオブジェクトであり、Array.prototypeを継承している
> Object.getPrototypeOf(arr) === Array.prototype
true
> // Array.prototypeの親はObject.prototype
> Object.getPrototypeOf(Array.prototype) === Object.prototype
true
> // Object.prototypeの親はnull（チェーンの終端）
> Object.getPrototypeOf(Object.prototype)
null
```
