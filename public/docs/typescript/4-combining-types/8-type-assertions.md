---
id: typescript-combining-types-8-type-assertions
title: 型アサーション (Type Assertions)
level: 2
---

## 型アサーション (Type Assertions)

時に、プログラマがTypeScriptコンパイラよりも型の詳細を知っている場合があります。例えば、外部APIからのレスポンスや、DOM要素の取得などです。

`as` キーワードを使うと、コンパイラに対して「この変数はこの型であるとして扱ってくれ」と強制できます。

```ts:assertion.ts
// unknown型は何でも入るが、そのままでは操作できない型
let someValue: unknown = "This is a string";

// コンパイラに「これはstringだからlengthを使わせて」と伝える
let strLength: number = (someValue as string).length;

console.log(strLength);

// 注意: 全く互換性のない型への変換はエラーになりますが、
// unknownを経由すると無理やり変換できてしまうため、乱用は避けてください。
// let wrong = (123 as string); // Error
// let dangerous = (123 as unknown as string); // OKだが実行時にバグの元
```

```ts-exec:assertion.ts
16
```
```js-readonly:assertion.js
```

> **注意:** 型アサーションはあくまで「コンパイル時の型チェックを黙らせる」機能であり、実行時の型変換を行うわけではありません。実行時に値が想定と違う場合、クラッシュの原因になります。可能な限り、型ガードを使って安全に絞り込むことを推奨します。
