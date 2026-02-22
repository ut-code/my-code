---
id: javascript-async-await-1-async
title: async 関数
level: 3
---

### `async` 関数

関数宣言の前に `async` キーワードを付けると、その関数は自動的に **Promiseを返す** ようになります。値を `return` した場合、それは `Promise.resolve(値)` と同じ意味になります。

```js-repl:1
> async function getMessage() { return "Hello, Async!"; }
undefined
> // async関数は常にPromiseを返す
> getMessage()
Promise { 'Hello, Async!' }

> // 通常のPromiseと同じくthenで値を取り出せる
> getMessage().then(v => console.log(v))
Promise { <pending> }
Hello, Async!
```
