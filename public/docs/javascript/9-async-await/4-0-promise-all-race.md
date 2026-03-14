---
id: javascript-async-await-promise-all-race
title: Promise.all() と Promise.race()
level: 2
question:
  - awaitを連発するとパフォーマンスが落ちるというのはどういうことですか？
  - 直列（シーケンシャル）とはどういう意味ですか？
  - 複数の非同期処理を並列で実行するメリットは何ですか？
---

## `Promise.all()` と `Promise.race()`

Async/Await は便利ですが、単純に `await` を連発すると、処理が**直列（シーケンシャル）**になってしまい、パフォーマンスが落ちる場合があります。複数の独立した非同期処理を行う場合は、並列実行を検討します。
