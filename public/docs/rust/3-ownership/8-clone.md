---
id: rust-ownership-8-clone
title: Clone：ディープコピー
level: 3
---

### Clone：ディープコピー

もしヒープ上のデータも含めて完全にコピーしたい場合は、明示的に `.clone()` メソッドを使用します。

```rust:clone_example.rs
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone(); // ヒープデータごとコピーする（コストは高い）

    println!("s1 = {}, s2 = {}", s1, s2);
}
```

```rust-exec:clone_example.rs
s1 = hello, s2 = hello
```
