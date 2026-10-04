---
id: javascript-functions-closures-practice2
title: '問題2: クロージャによる掛け算生成器'
level: 3
question: []
---

### 問題2: クロージャによる掛け算生成器

`createMultiplier` という[[関数]]を作成してください。この[[関数]]は[[数値]] `x` を引数に取り、呼び出すたびに「引数を `x` 倍して返す[[関数]]」を返します。

**使用例:**

```js:practice4_2.js
// ここに関数を作成


const double = createMultiplier(2);
console.log(double(5)); // 10

const triple = createMultiplier(3);
console.log(triple(5)); // 15
```

```js-exec:practice4_2.js
```
