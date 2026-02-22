---
id: typescript-combining-types-0-union
title: Union型 (共用体型)
level: 2
---

## Union型 (共用体型)

Union型（共用体型）は、**「A または B」**という状態を表現します。パイプ記号 `|` を使用して記述します。

JavaScriptでは変数の型が動的であるため、1つの変数に異なる型の値が入ることがよくありますが、TypeScriptではUnion型を使ってこれを安全に定義できます。

```ts:union-basic.ts
// idは数値、または文字列を許容する
let id: number | string;

id = 101;      // OK
id = "user-a"; // OK
// id = true;  // Error: Type 'boolean' is not assignable to type 'string | number'.

function printId(id: number | string) {
  console.log(`Your ID is: ${id}`);
}

printId(123);
printId("ABC");
```

```ts-exec:union-basic.ts
Your ID is: 123
Your ID is: ABC
```
```js-readonly:union-basic.js
```

> **注意点:** Union型を使用している変数は、その時点では「どの型か確定していない」ため、**すべての候補に共通するプロパティやメソッド**しか操作できません。特定の型として扱いたい場合は、後述する「型ガード」を使用します。
