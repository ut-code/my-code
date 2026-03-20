---
id: typescript-types-tuple
title: タプル (Tuple)
level: 3
question:
  - タプルが配列と違う「要素の数が固定」で「各要素の型が決まっている」とはどういう意味ですか？
  - タプルで宣言した要素の型や順序を間違えると、どのようなエラーが発生しますか？
  - タプルに宣言した数以上の要素を追加することはできますか？
---

### タプル (Tuple)

配列に似ていますが、**「要素の数が固定」**で、**「各要素の型が決まっている」**ものをタプルと呼びます。CSVの1行や、座標`(x, y)`などを表現するのに便利です。

```ts:tuples.ts
// [名前, 年齢, 有効フラグ] の順序と型を守る必要がある
let userTuple: [string, number, boolean];

userTuple = ["Alice", 30, true];
// userTuple = [30, "Alice", true]; // エラー: 型の順序が違う

console.log(`User: ${userTuple[0]}, Age: ${userTuple[1]}`);
```

```ts-exec:tuples.ts
User: Alice, Age: 30
```

```js-readonly:tuples.js
```
