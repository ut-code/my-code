---
id: typescript-async-utilities-error-handling
title: エラーハンドリングと型
level: 3
question:
  - Promiseが拒否される場合のエラー型がanyまたはunknownになるのはなぜですか？
  - エラーの型を指定する方法はないのですか？
  - try-catchブロックでエラーを捕捉する一般的な方法を教えてください。
---

### エラーハンドリングと型

Promiseが拒否（Reject）される場合のエラー型は、現状のTypeScriptではデフォルトで `any` または `unknown` として扱われます（`try-catch` ブロックの `error` オブジェクトなど）。
