---
id: typescript-function-types-rest-params
title: 残余引数 (Rest Parameters)
level: 2
question:
  - 可変長引数とは、どのような場合に使用するのですか
  - 残余引数でnumbersが必ず配列の型である必要があるのはなぜですか
  - 残余引数を他の引数と組み合わせる際のルールはありますか
---

## 残余引数 (Rest Parameters)

引数の数が可変である場合（可変長引数）、JavaScriptと同様に `...args` 構文を使用します。
TypeScriptでは、この `args` は必ず**配列の型**である必要があります。

```ts:rest_params.ts
// 数値を好きなだけ受け取り、合計を返す
function sumAll(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 文字列を結合する
function joinStrings(separator: string, ...words: string[]): string {
  return words.join(separator);
}

console.log(sumAll(1, 2, 3, 4, 5));
console.log(joinStrings("-", "TypeScript", "is", "fun"));
```

```ts-exec:rest_params.ts
15
TypeScript-is-fun
```
```js-readonly:rest_params.js
```
