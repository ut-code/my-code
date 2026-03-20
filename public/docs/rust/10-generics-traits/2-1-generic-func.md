---
id: rust-generics-traits-generic-func
title: ジェネリックな関数
level: 3
question:
  - '`inspect` 関数が「あまり役に立たない」とありますが、ジェネリックな関数はどのような時に使うと便利ですか？'
  - '`println!`でジェネリックな型 `T` の値をそのまま表示できないのはなぜですか？'
---

### ジェネリックな関数

もっとも単純な例として、型 `T` の引数をそのまま返す関数を考えてみましょう。

```rust:generic_function.rs
fn inspect<T>(value: T) {
    // 実際にはここで何か処理を行うが、
    // Tが何であるか（DisplayやDebug等）を知らないと
    // プリントすらできないため、ここでは単純にスコープを抜ける
}

fn main() {
    inspect(10);        // i32
    inspect(3.14);      // f64
    inspect("Hello");   // &str
    println!("Compilation successful.");
}
```

```rust-exec:generic_function.rs
Compilation successful.
```

これだけではあまり役に立ちませんが、構文としては `fn 関数名<型パラメータ>(引数)` という形になります。
