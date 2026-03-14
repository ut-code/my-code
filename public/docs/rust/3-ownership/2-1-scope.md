---
id: rust-ownership-scope
title: 変数のスコープ
level: 3
question:
  - このスコープの例は他の言語とほぼ同じとありますが、Rustの所有権の文脈でこの例を示すのはなぜですか？
  - スコープを抜けた瞬間にRustが自動的に呼び出すという`drop`関数は、私たち開発者が明示的に書く必要がありますか？
  - C++のRAIIパターンとは具体的にどのようなもので、Rustの所有権システムとどのように関連していますか？
---

### 変数のスコープ

まずは単純なスコープの例を見てみましょう。これは他の言語とほぼ同じです。

```rust:scope_example.rs
fn main() {
    {                      // s はここで宣言されていないので無効
        let s = "hello";   // s はここから有効になる
        println!("{}", s); // s を使用できる
    }                      // ここでスコープ終了。s は無効になる
}
```

```rust-exec:scope_example.rs
hello
```

ここで重要なのは、スコープを抜けた瞬間にRustが自動的にメモリを解放する処理（`drop`関数）を呼び出すという点です。これはC++のRAII (Resource Acquisition Is Initialization) パターンと同様です。
