---
id: typescript-combining-types-3-null-undefined
title: null と undefined
level: 2
---

## null と undefined

TypeScriptには `null` 型と `undefined` 型が存在します。
`tsconfig.json` の設定で `strictNullChecks: true`（推奨設定）になっている場合、これらは他の型（stringなど）には代入できません。

値が存在しない可能性がある場合は、Union型を使って明示的に `null` や `undefined` を許可します。

```ts:nullable.ts
// string または null を許容する
let userName: string | null = "Tanaka";

userName = null; // OK

// オプショナルなプロパティ（?）は 「型 | undefined」 の糖衣構文に近い動きをします
type UserConfig = {
  theme: string;
  notification?: boolean; // boolean | undefined
};

const config: UserConfig = {
  theme: "dark"
  // notification は省略可能 (undefined)
};

console.log(`User: ${userName}, Theme: ${config.theme}`);
```

```ts-exec:nullable.ts
User: null, Theme: dark
```
```js-readonly:nullable.js
```
