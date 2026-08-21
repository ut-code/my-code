---
id: dart-async-future
title: Future の仕組み
level: 2
question:
  - Futureとは具体的に何を表すオブジェクトですか？
  - JavaScriptのPromiseとFutureの共通点は何ですか？
term:
  - Future
  - Future.value
  - Future.delayed
---

## `Future` の仕組み

**`Future<T>`** は、「将来のある時点で値 `T` またはエラーを返す非同期処理の結果」を表すオブジェクトです（JavaScriptの `Promise` や Rustの `Future` に相当します）。
