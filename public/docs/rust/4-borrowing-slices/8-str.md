---
id: rust-borrowing-slices-8-str
title: 文字列スライス（&str）
level: 3
---

### 文字列スライス（`&str`）

特に重要なのが文字列スライスです。`String` の一部を切り出して参照します。
書き方は `[開始インデックス..終了インデックス]` です。

```rust:string_slices.rs
fn main() {
    let s = String::from("Hello Rust World");

    let hello = &s[0..5]; // 0番目から4番目まで（5は含まない）
    let rust = &s[6..10]; // 6番目から9番目まで

    println!("Slice 1: {}", hello);
    println!("Slice 2: {}", rust);

    // 省略記法
    let len = s.len();
    let start = &s[0..5];
    let start_short = &s[..5]; // 0は省略可能

    let end = &s[6..len];
    let end_short = &s[6..];   // 末尾も省略可能

    let all = &s[..];          // 全体
    
    println!("Full: {}", all);
}
```

```rust-exec:string_slices.rs
Slice 1: Hello
Slice 2: Rust
Full: Hello Rust World
```
