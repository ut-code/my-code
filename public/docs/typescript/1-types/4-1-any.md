---
id: typescript-types-any
title: 'any: 危険な「何でもあり」'
level: 3
question:
  - '`any`型を使うとTypeScriptを使うメリットが失われるというのはなぜですか？'
  - '`any`型を使わなければいけないような状況はありますか？'
---

### `any`: 危険な「何でもあり」

`any` 型は、型チェックを無効にする型です。JavaScriptと同じ挙動になりますが、TypeScriptを使うメリットが失われるため、**可能な限り使用を避けてください**。

```ts:any_type.ts
let looseVariable: any = 4;
looseVariable = "Maybe a string instead";
looseVariable = false; // エラーにならない（危険！）
console.log(looseVariable);
```

```ts-exec:any_type.ts
false
```
```js-readonly:any_type.js
```
