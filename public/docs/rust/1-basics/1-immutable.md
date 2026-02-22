---
id: rust-basics-1-immutable
title: 不変変数（Immutable）
level: 3
---

### 不変変数（Immutable）

まず、以下のコードを見てください。これは意図的にコンパイルエラーになるように書かれています。

```rust:immutability_error.rs
fn main() {
    let x = 5;
    println!("xの値は: {}", x);
    
    // 値を再代入しようとする（コンパイルエラーになる）
    x = 6; 
    println!("xの値は: {}", x);
}
```

```rust-exec:immutability_error.rs
error[E0384]: cannot assign twice to immutable variable `x`
 --> immutability_error.rs:6:5
  |
2 |     let x = 5;
  |         - first assignment to `x`
...
6 |     x = 6; 
  |     ^^^^^ cannot assign twice to immutable variable
  |

```

これをコンパイルしようとすると、Rustコンパイラは「不変変数 `x` に二度代入することはできない」と強く叱ってくれます。
