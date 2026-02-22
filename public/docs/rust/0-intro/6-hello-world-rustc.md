---
id: rust-intro-6-hello-world-rustc
title: Hello World (rustc を直接使う)
level: 2
---

## Hello World (`rustc` を直接使う)

まずは、ビルドシステムを使わずにコンパイラ `rustc` を直接叩いて、Rustプログラムの最小単位を見てみましょう。

以下のコードを記述します。

```rust:hello.rs
fn main() {
    // !がついているのは関数ではなく「マクロ」の呼び出しです
    println!("Hello, world from rustc!");
}
```

コンパイルと実行は以下の手順で行います。

1.  コンパイル: `rustc hello.rs`
      * これにより、バイナリファイル（Windowsなら`.exe`）が生成されます。
2.  実行: `./hello` (Windowsなら `.\hello.exe`)

<!-- end list -->

```rust-exec:hello.rs
Hello, world from rustc!
```
