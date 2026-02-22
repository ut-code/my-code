---
id: rust-basics-2-mutable
title: 可変変数（Mutable）
level: 3
---

### 可変変数（Mutable）

値を変更したい場合は、`mut`（mutableの略）キーワードを明示的に付ける必要があります。これにより、「この変数は値が変わる可能性がある」とコードの読み手やコンパイラに宣言します。

```rust:mutability_demo.rs
fn main() {
    // mut をつけることで可変になる
    let mut x = 5;
    println!("xの値は: {}", x);
    
    x = 6;
    println!("xの値は: {}", x);
}
```

```rust-exec:mutability_demo.rs
xの値は: 5
xの値は: 6
```

> **なぜデフォルトが不変なのか？**
> 大規模なシステムや並行処理において、「いつの間にか値が変わっている」ことはバグの主要な原因です。Rustは「変更が必要な箇所だけを明示的にする」ことで、コードの予測可能性と安全性を高めています。
