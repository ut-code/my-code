---
id: typescript-function-types-default
title: デフォルト引数 (=)
level: 3
question:
  - ES6のデフォルト引数とTypeScriptのデフォルト引数に違いはありますか
  - デフォルト引数がある場合に型推論されるとは、具体的にどういうことですか
  - デフォルト引数を指定した場合、その引数はなぜ省略可能として扱われるのですか
---

### デフォルト引数 (`=`)

ES6（JavaScript）と同様に、引数にデフォルト値を指定できます。デフォルト値がある場合、TypeScriptはその引数を「型推論」し、かつ「省略可能」として扱います。

```ts:optional_default.ts
// titleは省略可能
function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }
  return `Hello, ${name}!`;
}

// powerのデフォルト値は2
// 戻り値の型はnumberと推論されるため省略可能
function exponent(base: number, power: number = 2) {
  return base ** power;
}

console.log(greet("Tanaka"));
console.log(greet("Sato", "Dr."));
console.log(`2^2 = ${exponent(2)}`);
console.log(`2^3 = ${exponent(2, 3)}`);
```

```ts-exec:optional_default.ts
Hello, Tanaka!
Hello, Dr. Sato!
2^2 = 4
2^3 = 8
```
```js-readonly:optional_default.js
```
