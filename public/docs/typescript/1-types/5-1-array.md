---
id: typescript-types-array
title: 配列 (Array)
level: 3
question:
  - 配列の型定義で`型[]`と`Array<型>`の2通りの書き方がありますが、どちらを使うのが一般的ですか？
  - '`number[]`として宣言した配列に、文字列型の要素を追加しようとするとどうなりますか？'
---

### 配列 (Array)

配列の型定義には2通りの書き方があります。

1.  `型[]` （推奨：シンプル）
2.  `Array<型>` （ジェネリクス記法）

```ts:arrays.ts
// 数値の配列
let fibonacci: number[] = [1, 1, 2, 3, 5];

// 文字列の配列（Array<T>記法）
let frameworkList: Array<string> = ["React", "Vue", "Angular"];

console.log("First Framework:", frameworkList[0]);

// fibonacci.push("8"); // エラー: number[] に string は追加できない
fibonacci.push(8); // OK
console.log("Next Fib:", fibonacci[fibonacci.length - 1]);
```

```ts-exec:arrays.ts
First Framework: React
Next Fib: 8
```
```js-readonly:arrays.js
```
