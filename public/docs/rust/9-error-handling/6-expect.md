---
id: rust-error-handling-6-expect
title: expect
level: 3
---

### `expect`

`unwrap` と同じ挙動ですが、パニック時に表示するメッセージを指定できます。**デバッグのしやすさから、通常は `unwrap` よりも `expect` が推奨されます。**

```rust:unwrap_expect.rs
fn main() {
    let valid_str = "100";
    let invalid_str = "hello";

    // 1. unwrap: 成功時は値を返す
    let n: i32 = valid_str.parse().unwrap();
    println!("パース成功: {}", n);

    // 2. expect: 失敗時は指定したメッセージと共に panic! する
    // 以下の行を実行するとクラッシュします
    let _m: i32 = invalid_str.parse().expect("数値のパースに失敗しました");
}
```

```rust-exec:unwrap_expect.rs
thread 'main' panicked at unwrap_expect.rs:11:35:
数値のパースに失敗しました: ParseIntError { kind: InvalidDigit }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

**使い所のヒント:**

  * **プロトタイピング・実験:** `unwrap` を多用してロジックを素早く組む。
  * **テストコード:** テスト中に失敗したらテスト自体を落としたいので `unwrap` が有用。
  * **「絶対に失敗しない」ロジック:** 理論上エラーにならない場合でも、型合わせのために `unwrap` が必要な場合があります。
