---
id: javascript-functions-closures-8-rest
title: Restパラメータ (残余引数)
level: 3
---

### Restパラメータ (残余引数)

引数の数が不定の場合、`...` を使うことで、残りの引数を**配列として**受け取ることができます。以前は `arguments` オブジェクトを使っていましたが、Restパラメータの方が配列メソッド（`map`, `reduce`など）を直接使えるため便利です。

```js:rest_params.js
const sum = (...numbers) => {
  // numbersは本物の配列 [1, 2, 3, 4, 5]
  return numbers.reduce((acc, curr) => acc + curr, 0);
};

console.log(sum(1, 2, 3));
console.log(sum(10, 20, 30, 40, 50));
```

```js-exec:rest_params.js
6
150
```
