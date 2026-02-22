---
id: rust-error-handling-2-resultt-e
title: '回復可能なエラー (Result<T, E>)'
level: 2
---

## 回復可能なエラー (`Result<T, E>`)

Rustのエラーハンドリングの主役は `Result` 列挙型です。以前の章で学んだ `Option` に似ていますが、失敗した場合に「なぜ失敗したか（エラー内容）」を持つ点が異なります。

定義は以下のようになっています（標準ライブラリに含まれています）。

```rust
enum Result<T, E> {
    Ok(T),  // 成功時：値 T を含む
    Err(E), // 失敗時：エラー E を含む
}
```
