---
id: javascript-functions-rest-arg
title: Restパラメータ (残余引数)
level: 3
question:
  - 引数の数が不定な場合とは、具体的にどんなケースを指しますか？
  - 以前使われていた `arguments` オブジェクトとは何ですか？なぜRestパラメータの方が良いのですか？
  - Restパラメータは必ず最後の引数としてしか使えないのですか？
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
