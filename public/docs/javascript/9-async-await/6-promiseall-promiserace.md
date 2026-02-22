---
id: javascript-async-await-6-promiseall-promisera
title: Promise.all() と Promise.race()
level: 2
---

## Promise.all() と Promise.race()

Async/Await は便利ですが、単純に `await` を連発すると、処理が**直列（シーケンシャル）**になってしまい、パフォーマンスが落ちる場合があります。複数の独立した非同期処理を行う場合は、並列実行を検討します。
