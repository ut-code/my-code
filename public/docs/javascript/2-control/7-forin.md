---
id: javascript-control-7-forin
title: for...in ループ（プロパティ名の列挙）
level: 3
---

### for...in ループ（プロパティ名の列挙）

`for...in` はオブジェクトの **キー（プロパティ名）** を列挙するために設計されています。
配列に対して使用すると、インデックス（"0", "1", ...）が文字列として返ってくるだけでなく、プロトタイプチェーン上のプロパティまで列挙してしまうリスクがあるため、**配列への使用は推奨されません**。

```js:for_in_example.js
const user = {
    name: "Bob",
    age: 30,
    role: "admin"
};

// オブジェクトのキーを列挙する
for (const key in user) {
    console.log(`${key}: ${user[key]}`);
}

// 配列に対する for...in（非推奨の例）
const colors = ["Red", "Green"];
Array.prototype.badProp = "Do not do this"; // プロトタイプ汚染のシミュレーション

console.log("--- Array via for...in ---");
for (const index in colors) {
    console.log(index); // "0", "1", "badProp" が出力される可能性がある
}
```

```js-exec:for_in_example.js
name: Bob
age: 30
role: admin
--- Array via for...in ---
0
1
badProp
```
