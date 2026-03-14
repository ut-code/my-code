---
id: rust-error-handling-unwrap
title: unwrap
level: 3
question:
  - '`unwrap` がパニックした場合、具体的にどのようなエラーメッセージが表示されますか？'
  - '`unwrap` を使うことでどのようなリスクがありますか？'
---

### `unwrap`

`Result` が `Ok` なら中身を返し、`Err` なら即座に `panic!` します。手っ取り早いですが、エラーメッセージは一般的で詳細が含まれません。
