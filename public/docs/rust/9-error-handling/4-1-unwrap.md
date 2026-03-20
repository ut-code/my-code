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

```rust:unwrap_expect.rs
fn main() {
    let valid_str = "100";
    let invalid_str = "hello";

    // 成功時は値を返す
    let n: i32 = valid_str.parse().unwrap();
    println!("パース成功: {}", n);

    // 失敗時は指定したメッセージと共に panic! する
    // 以下の行を実行するとクラッシュします
    let _m: i32 = invalid_str.parse().unwrap();
}
```

```rust-exec:unwrap_expect.rs
thread 'main' panicked at unwrap_expect.rs:11:35:
called `Result::unwrap()` on an `Err` value: ParseIntError { kind: InvalidDigit }
```

