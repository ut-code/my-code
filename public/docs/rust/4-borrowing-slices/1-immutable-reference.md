---
id: rust-borrowing-slices-1-immutable-reference
title: 不変参照（Immutable Reference）
level: 3
---

### 不変参照（Immutable Reference）

デフォルトでは、参照は**不変**です。借りた値を読むことはできますが、変更することはできません。参照を作成するには `&` を使います。

```rust:calculate_length.rs
fn main() {
    let s1 = String::from("hello");

    // &s1 で s1 への参照を渡す（所有権は移動しない）
    let len = calculate_length(&s1);

    // 所有権は移動していないので、ここで s1 をまだ使える！
    println!("The length of '{}' is {}.", s1, len);
}

// 引数の型が &String になっていることに注目
fn calculate_length(s: &String) -> usize {
    s.len()
} // ここで s がスコープを抜けるが、所有権を持っていないのでメモリは解放されない
```

```rust-exec:calculate_length.rs
The length of 'hello' is 5.
```
