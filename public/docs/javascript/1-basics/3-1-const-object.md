---
id: javascript-basics-const-object
title: const とオブジェクトの変更
level: 3
question:
  - constは再代入不可なのに、constで宣言したオブジェクトのプロパティは変更できるのはなぜですか？
  - 「参照先のメモリアドレス」と「ヒープ領域にあるデータ」の違いについて、もう少し詳しく説明してもらえますか？
  - オブジェクトの中身も変更させたくない場合は、どうすれば良いですか？
---

### const とオブジェクトの変更

重要な点として、`const` で宣言した変数は「再代入」ができませんが、中身がオブジェクトの場合、**プロパティの変更は可能**です。これは `const` が「参照先のメモリアドレス」を固定するものであり、ヒープ領域にあるデータそのものを不変にするわけではないためです。

```js:object_mutation.js
const user = {
    name: "Alice",
    id: 1
};

// 再代入はエラーになる
// user = { name: "Bob" }; // TypeError: Assignment to constant variable.

// プロパティの変更は可能
user.name = "Bob";
console.log(user);

// 配列もオブジェクトの一種
const colors = ["Red", "Green"];
colors.push("Blue");
console.log(colors);
```

```js-exec:object_mutation.js
{ name: 'Bob', id: 1 }
[ 'Red', 'Green', 'Blue' ]
```
