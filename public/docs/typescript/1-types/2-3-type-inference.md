---
id: typescript-types-2-3-type-inference
title: 2.3 型推論 (Type Inference)
level: 2
---

## 2.3 型推論 (Type Inference)

ここがJavaScript経験者にとって嬉しいポイントです。
変数の初期化と同時に値を代入する場合、**型注釈を省略してもTypeScriptが自動的に型を判別**してくれます。これを「型推論」と呼びます。

```ts:inference.ts
// 型注釈がないが、"TypeScript"という文字列から string型 と推論される
let techName = "TypeScript"; 

// 数値が入っているため、count は number型 と推論される
let count = 42;

console.log(`Technology: ${techName}, Count: ${count}`);

// 推論された型と違う値を入れようとするとエラーになる
// count = "Forty-Two"; // Error!
```

```ts-exec:inference.ts
Technology: TypeScript, Count: 42
```
```js-readonly:inference.js
```

> **ベストプラクティス:** 初期値がある場合、わざわざ `: string` などを書く必要はありません。コードが冗長になるのを防ぐため、明示的な型注釈は「初期値がない場合」や「推論される型とは別の型として扱いたい場合」に使用するのが一般的です。
