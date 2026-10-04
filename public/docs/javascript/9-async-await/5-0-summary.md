---
id: javascript-async-await-summary
title: この章のまとめ
level: 2
question: []
---

## この章のまとめ

  * **[[Async/Await]]**: `[[Promise]]` をベースにした[[糖衣構文]]。[[非同期処理]]を[[同期処理]]のように記述でき、可読性が高い。
  * **Error Handling**: [[同期処理|同期コード]]と同じく `[[try...catch]]` が使用可能。
  * **[[Fetch API]]**: モダンなHTTP通信API。`response.ok` でステータスを確認し、`response.json()` でボディをパースする2段構えが必要。
  * **[[並列処理]]**: 独立した複数の[[非同期処理]]は `[[`await`]]` を連続させるのではなく、`[[Promise.all|Promise.all()]]` を使用して[[並列処理|並列化]]することでパフォーマンスを向上させる。
