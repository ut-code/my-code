---
id: javascript-async-await-async
title: async 関数
level: 3
question:
  - asyncキーワードは関数のどこに付ければいいですか？
  - async関数が常にPromiseを返すのはなぜですか？
  - Promise.resolve(値)とは具体的にどういう意味ですか？
  - Promise { 'Hello, Async!' }のPromiseとは何ですか？
  - getMessage().then(v => console.log(v))のvは何を表していますか？
---

### `async` 関数

関数宣言の前に `async` キーワードを付けると、その関数は自動的に **Promiseを返す** ようになります。値を `return` した場合、それは `Promise.resolve(値)` と同じ意味になります。

```js-repl
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
