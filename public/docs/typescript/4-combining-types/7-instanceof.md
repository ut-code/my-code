---
id: typescript-combining-types-7-instanceof
title: instanceof 演算子
level: 3
---

### instanceof 演算子

クラスのインスタンスかどうかを判定します（第7章のクラスで詳しく扱いますが、Dateなどの組み込みオブジェクトでも有効です）。

```ts:type-guard-instanceof.ts
function logDate(value: string | Date) {
  if (value instanceof Date) {
    console.log(value.toISOString());
  } else {
    console.log(value);
  }
}
```
```js-readonly:type-guard-instanceof.js
```
