---
id: javascript-basics-12-falsy
title: Falsyな値
level: 3
---

### Falsyな値

条件式（if文など）で `false` とみなされる値を「Falsyな値」と呼びます。これ以外はすべて `true`（Truthy）として扱われます。

**Falsyな値のリスト:**

1.  `false`
2.  `0` (数値のゼロ)
3.  `-0`
4.  `0n` (BigIntのゼロ)
5.  `""` (空文字)
6.  `null`
7.  `undefined`
8.  `NaN` (Not a Number)

**注意:** 空の配列 `[]` や空のオブジェクト `{}` は **Truthy** です。

```js:falsy_check.js
const values = [0, "0", [], null, undefined, ""];

values.forEach(val => {
    if (val) {
        console.log(`Value: [${val}] is Truthy`);
    } else {
        console.log(`Value: [${val}] is Falsy`);
    }
});
```

```js-exec:falsy_check.js
Value: [0] is Falsy
Value: [0] is Truthy
Value: [] is Truthy
Value: [null] is Falsy
Value: [undefined] is Falsy
Value: [] is Falsy
```
