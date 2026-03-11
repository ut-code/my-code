---
id: javascript-async-await-async-await
title: Async/Await 構文
level: 2
question:
  - Async/Awaitは何をするためのものですか？
  - Promiseのシンタックスシュガーとはどういう意味ですか？
  - Async/Awaitを使うと本当に同期処理のようになるのですか？
  - Async/Awaitはいつ使うと便利ですか？
---

## Async/Await 構文

`async` と `await` は、ES2017で導入された `Promise` の**シンタックスシュガー（糖衣構文）**です。これを使うことで、非同期処理をあたかも「同期処理」のように上から下へと流れるコードとして記述できます。
