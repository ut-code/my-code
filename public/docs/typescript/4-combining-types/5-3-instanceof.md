---
id: typescript-combining-types-instanceof
title: instanceof 演算子
level: 3
question:
  - instanceof演算子もJavaScriptにありますが、TypeScriptで使う利点は何ですか？
  - 第7章で詳しく扱われる「クラス」とは何ですか？
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
