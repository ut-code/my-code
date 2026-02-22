---
id: typescript-objects-interfaces-1-type
title: '型エイリアス (type): 型に名前を付ける'
level: 2
---

## 型エイリアス (type): 型に名前を付ける

**型エイリアス（Type Alias）**を使用すると、特定の型定義に名前を付け、それを再利用することができます。JavaScriptの経験がある方にとって、これは「型の変数」を作るようなものだとイメージしてください。

キーワードは `type` です。慣習として型名には **PascalCase**（大文字始まり）を使用します。

```ts:type-alias.ts
// User型を定義
type User = {
  name: string;
  age: number;
  email: string;
};

// 定義したUser型を使用
const user1: User = {
  name: "Tanaka",
  age: 28,
  email: "tanaka@example.com",
};

const user2: User = {
  name: "Suzuki",
  age: 34,
  email: "suzuki@example.com",
};

// 関数の引数としても利用可能
function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(greet(user1));
```

```ts-exec:type-alias.ts
Hello, Tanaka!
```

```js-readonly:type-alias.js
```
