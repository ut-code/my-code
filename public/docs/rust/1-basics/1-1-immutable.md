---
id: rust-basics-immutable
title: 不変変数（Immutable）
level: 3
question:
  - 不変変数に値を再代入できないのはなぜですか？
  - E0384というコンパイルエラーはどのような状況で発生するのですか？
  - first assignment to `x`というメッセージはどのコード行を指していますか？
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
