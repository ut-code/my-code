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

```ts:arrays_tuples.ts
// --- 配列 ---
// 数値の配列
let fibonacci: number[] = [1, 1, 2, 3, 5];

// 文字列の配列（Array<T>記法）
let frameworkList: Array<string> = ["React", "Vue", "Angular"];

// --- タプル ---
// [名前, 年齢, 有効フラグ] の順序と型を守る必要がある
let userTuple: [string, number, boolean];

userTuple = ["Alice", 30, true];
// userTuple = [30, "Alice", true]; // エラー: 型の順序が違う

console.log("First Framework:", frameworkList[0]);
console.log(`User: ${userTuple[0]}, Age: ${userTuple[1]}`);

// fibonacci.push("8"); // エラー: number[] に string は追加できない
fibonacci.push(8); // OK
console.log("Next Fib:", fibonacci[fibonacci.length - 1]);
```

```ts-exec:arrays_tuples.ts
First Framework: React
User: Alice, Age: 30
Next Fib: 8
```
```js-readonly:arrays_tuples.js
```
