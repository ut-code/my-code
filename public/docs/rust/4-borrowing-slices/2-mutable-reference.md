---
id: rust-borrowing-slices-2-mutable-reference
title: 可変参照（Mutable Reference）
level: 3
---

### 可変参照（Mutable Reference）

借りた値を変更したい場合は、**可変参照**を使用します。これには `&mut` を使い、元の変数も `mut` である必要があります。

```rust:mutable_borrow.rs
fn main() {
    let mut s = String::from("hello");

    change(&mut s); // 可変参照を渡す

    println!("Result: {}", s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

```rust-exec:mutable_borrow.rs
Result: hello, world
```
