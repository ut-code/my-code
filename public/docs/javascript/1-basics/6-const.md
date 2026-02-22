---
id: javascript-basics-6-const
title: const とオブジェクトの変更
level: 3
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

主なオブジェクト型には以下があります。

  * **Object**: キーと値のペアの集合（辞書、ハッシュマップに近い）。
  * **Array**: 順序付きリスト。
  * **Function**: JavaScriptでは関数もオブジェクトであり、変数に代入したり引数として渡すことができます（第一級関数）。
