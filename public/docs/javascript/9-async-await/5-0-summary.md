---
id: javascript-async-await-summary
title: この章のまとめ
level: 2
question:
  - Async/Awaitを使う一番のメリットは何ですか？
  - Fetch APIでresponse.okを確認する必要があるのはなぜですか？
  - Fetch APIでresponse.json()が「2段構え」とはどういうことですか？
  - 並列処理と直列処理の使い分けのポイントは何ですか？
---

## この章のまとめ

  * **Async/Await**: `Promise` をベースにした糖衣構文。非同期処理を同期処理のように記述でき、可読性が高い。
  * **Error Handling**: 同期コードと同じく `try...catch` が使用可能。
  * **Fetch API**: モダンなHTTP通信API。`response.ok` でステータスを確認し、`response.json()` でボディをパースする2段構えが必要。
  * **並列処理**: 独立した複数の非同期処理は `await` を連続させるのではなく、`Promise.all()` を使用して並列化することでパフォーマンスを向上させる。
