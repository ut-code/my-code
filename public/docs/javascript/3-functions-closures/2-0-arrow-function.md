---
id: javascript-arrow-function-basic
title: 'アロー関数 (=>) の構文と特徴'
level: 2
---

## アロー関数 (`=>`) の構文と特徴

ES2015 (ES6) で導入されたアロー関数は、関数式をより短く記述するための構文です。
`function` キーワードを省略し、`=>` (矢印) を使って定義します。
Javaのラムダ式やPythonのlambdaに似ていますが、いくつか独自の特徴があります。

```js:arrow_function.js
// 従来の関数式
const add = function(a, b) {
  return a + b;
};

// アロー関数
const addArrow = (a, b) => {
  return a + b;
};

console.log(addArrow(3, 5));
```

```js-exec:arrow_function.js
8
```
