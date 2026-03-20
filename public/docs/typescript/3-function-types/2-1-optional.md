---
id: typescript-function-types-optional
title: オプショナル引数 (?)
level: 3
question:
  - オプショナル引数で省略された場合の値がundefinedになるのは、どのようなメリットがありますか
  - オプショナル引数を必須引数の後ろに配置する必要があるのはなぜですか
---

### オプショナル引数 (`?`)

引数名の後ろに `?` を付けることで、その引数を省略可能（オプショナル）にできます。省略された場合の値は `undefined` です。

> **注意:** オプショナル引数は、必ず必須引数の**後ろ**に配置する必要があります。

```ts:optional.ts
// titleは省略可能
function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }
  return `Hello, ${name}!`;
}

console.log(greet("Tanaka"));
console.log(greet("Sato", "Dr."));
```

```ts-exec:optional.ts
Hello, Tanaka!
Hello, Dr. Sato!
```
```js-readonly:optional.js
```
