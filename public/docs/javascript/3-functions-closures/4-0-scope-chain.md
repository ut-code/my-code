---
id: javascript-functions-scope-chain
title: スコープチェーンとレキシカルスコープ
level: 2
question:
  - スコープとは具体的に何のことですか？
  - 「レキシカルスコープ」と「スコープチェーン」はどのように関係していますか？
  - 関数が「どこで定義されたか」によってスコープが決まるというのはどういうことですか？
term:
  - スコープ
  - レキシカルスコープ
  - スコープチェーン
  - Lexical Scope
  - Scope Chain
---

## スコープチェーンとレキシカルスコープ

JavaScriptの[[変数]]の有効範囲（[[スコープ]]）を理解するために、「[[レキシカルスコープ]]」という概念を知る必要があります。

  * **[[レキシカルスコープ]] (Lexical Scope):** [[関数]]が「どこで呼び出されたか」ではなく、**「どこで定義されたか」**によって[[スコープ]]が決まるというルールです。
  * **[[スコープチェーン]] (Scope Chain):** [[変数]]を探す際、現在の[[スコープ]]になければ、定義時の外側の[[スコープ]]へと順番に探しに行く仕組みです。

```js:scope.js
const globalVar = "Global";

function outer() {
 const outerVar = "Outer";
 function inner() {
   const innerVar = "Inner";
   // innerの中からouterVarとglobalVarが見える（スコープチェーン）
   return `${globalVar} > ${outerVar} > ${innerVar}`;
 }
 return inner();
}

console.log(outer());
```

```js-exec:scope.js
Global > Outer > Inner
```
