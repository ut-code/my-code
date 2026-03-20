---
id: typescript-types-never
title: 'never: 決して発生しない'
level: 3
question:
  - '`never`型はどんな関数の戻り値として使われることが多いですか？'
  - '`void`型と`never`型は何が違うんですか？'
  - '`never`型を変数の型として宣言することはできますか？'
---

### `never`: 決して発生しない

`never` は「値を持たない」ことを意味します。常に例外を投げる関数や、無限ループなど「終了しない関数」の戻り値として使われます。

```ts:never_type.ts
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

```ts-exec:never_type.ts
Error caught
```
```js-readonly:never_type.js
```
