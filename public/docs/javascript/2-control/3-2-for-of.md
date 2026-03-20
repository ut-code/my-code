---
id: javascript-control-for-of
title: for...of ループ（反復可能オブジェクトの走査）
level: 3
question:
  - Iterable（反復可能）なオブジェクトとは何ですか？どのようなものが含まれますか？
  - >-
    Object.keys()やObject.values()、Object.entries()を使うとありますが、これらはfor...ofとどのように組み合わせて使うのですか？
  - 文字列もfor...ofでループできるのはなぜですか？
---

### `for...of` ループ（反復可能オブジェクトの走査）

ES2015 (ES6) で導入された `for...of` は、**値（Values）** を反復します。
配列、文字列、Map、Setなどの **Iterable（反復可能）** なオブジェクトに対して使用します。配列の中身を順番に処理したい場合は、こちらが正解です。

```js:for_of_example.js
const languages = ["JavaScript", "Python", "Go"];

// 配列の値を直接取得できる
for (const lang of languages) {
    console.log(lang);
}

// 文字列もIterable
const word = "AI";
for (const char of word) {
    console.log(char);
}
```

```js-exec:for_of_example.js
JavaScript
Python
Go
A
I
```

> **Tips:** オブジェクトの中身を `for...of` で回したい場合は、`Object.keys()`, `Object.values()`, `Object.entries()` を使うのがモダンな手法です。

```js
const obj = { a: 1, b: 2 };
for (const [key, val] of Object.entries(obj)) {
    console.log(key, val);
}
```
