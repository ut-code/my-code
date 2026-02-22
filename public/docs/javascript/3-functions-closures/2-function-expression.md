---
id: javascript-functions-closures-2-function-expression
title: 2. 関数式 (Function Expression)
level: 3
---

### 2\. 関数式 (Function Expression)

変数に関数を代入するスタイルです。変数の代入は実行時に行われるため、定義する前に呼び出すとエラーになります。現代のJavaScript開発では、意図しない巻き上げを防ぐためにこちら（または後述のアロー関数）が好まれる傾向にあります。

```js:function_expression.js
// 定義前に呼び出すと... ReferenceError: Cannot access 'sayHi' before initialization
// console.log(sayHi("Bob"));

const sayHi = function(name) {
  return `Hi, ${name}!`;
};

console.log(sayHi("Bob"));
```

```js-exec:function_expression.js
Hi, Bob!
```
