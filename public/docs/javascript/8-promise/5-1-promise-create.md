---
id: javascript-promise-create
title: Promiseの作成
level: 3
question:
  - new Promiseの引数に渡す関数（Executor）のresolveとrejectは、それぞれどのような役割を持つ関数ですか？
  - コード例の`const success = true;`という行は、常にtrueである必要があるのでしょうか？
  - Promise { 'OK!' } と表示されている結果の「OK!」という値は、どのように取り出せばよいですか？
  - rejectで渡している`new Error("Failed")`のエラーオブジェクトは、なぜ必要なのでしょうか？
---

### Promiseの作成

`new Promise` コンストラクタを使用します。引数には `(resolve, reject)` を受け取る関数（Executor）を渡します。

```js-repl
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
