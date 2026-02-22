---
id: typescript-types-0-1-type-annotations
title: 2.1 型注釈の構文 (Type Annotations)
level: 2
---

## 2.1 型注釈の構文 (Type Annotations)

変数を宣言する際、その変数がどのような種類のデータを扱うかを明示することを「型注釈（Type Annotation）」と呼びます。
構文は非常にシンプルで、変数名の後ろに `: 型名` を記述します。

```ts:annotation.ts
// 文字列型の変数を宣言
let message: string = "Hello, TypeScript!";

// 数値型の定数を宣言
const userId: number = 1001;

// コンソールに出力
console.log(message);
console.log(`User ID: ${userId}`);

// エラーになる例（コメントアウトを外すとエディタ上で赤線が出ます）
// message = 123; // Error: Type 'number' is not assignable to type 'string'.
```

```ts-exec:annotation.ts
Hello, TypeScript!
User ID: 1001
```
```js-readonly:annotation.js
```

> **ポイント:** JavaScriptでは変数にどんな値でも再代入できましたが、TypeScriptでは宣言された型と異なる値を代入しようとすると、コンパイルエラー（またはエディタ上の警告）が発生します。これがバグを未然に防ぐ第一の砦です。
