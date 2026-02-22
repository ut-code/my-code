---
id: javascript-promise-5-promise
title: Promiseの作成
level: 3
---

### Promiseの作成

`new Promise` コンストラクタを使用します。引数には `(resolve, reject)` を受け取る関数（Executor）を渡します。

```js-repl:1
> const myPromise = new Promise((resolve, reject) => {
...   // ここで非同期処理を行う
...   const success = true;
...   if (success) {
...     resolve("OK!"); // 成功時
...   } else {
...     reject(new Error("Failed")); // 失敗時
...   }
... });
undefined
> myPromise
Promise { 'OK!' }
```
