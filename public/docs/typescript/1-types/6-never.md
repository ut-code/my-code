---
id: typescript-types-6-never
title: 'never: 決して発生しない'
level: 3
---

### never: 決して発生しない

`never` は「値を持たない」ことを意味します。常に例外を投げる関数や、無限ループなど「終了しない関数」の戻り値として使われます。

```ts:special_types.ts
// --- any の例 ---
let looseVariable: any = 4;
looseVariable = "Maybe a string instead";
looseVariable = false; // エラーにならない（危険！）
console.log("Any:", looseVariable);

// --- unknown の例 ---
let uncertainValue: unknown = "I am actually a string";

// uncertainValue.toUpperCase(); // エラー: Object is of type 'unknown'.

// 型チェック（絞り込み）を行うと使用可能になる
if (typeof uncertainValue === "string") {
    console.log("Unknown (checked):", uncertainValue.toUpperCase());
}

// --- never の例 ---
function throwError(message: string): never {
    throw new Error(message);
}

try {
    // この関数は決して正常に戻らない
    throwError("Something went wrong");
} catch (e) {
    console.log("Error caught");
}
```

```ts-exec:special_types.ts
Any: false
Unknown (checked): I AM ACTUALLY A STRING
Error caught
```
```js-readonly:special_types.js
```
