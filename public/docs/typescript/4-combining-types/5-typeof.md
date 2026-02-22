---
id: typescript-combining-types-5-typeof
title: typeof 演算子
level: 3
---

### typeof 演算子

プリミティブ型（string, number, boolean, symbol, undefined）の判定に使います。

```ts:type-guard-typeof.ts
function formatPrice(price: number | string) {
  // ここでは price は number | string

  if (typeof price === 'string') {
    // このブロック内では price は 'string' 型として扱われる
    return parseInt(price).toLocaleString();
  } else {
    // このブロック内では price は 'number' 型として扱われる
    return price.toLocaleString();
  }
}

console.log(formatPrice(10000));
console.log(formatPrice("20000"));
```

```ts-exec:type-guard-typeof.ts
10,000
20,000
```
```js-readonly:type-guard-typeof.js
```
