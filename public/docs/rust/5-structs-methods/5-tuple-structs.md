---
id: rust-structs-methods-5-tuple-structs
title: タプル構造体 (Tuple Structs)
level: 3
---

### タプル構造体 (Tuple Structs)

フィールドに名前がなく、型だけが並んでいる構造体です。「型」として区別したい場合に便利です。例えば、同じ `(i32, i32, i32)` でも、「色」と「座標」は計算上混ぜるべきではありません。

```rust:tuple_structs.rs
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);

    // black と origin は構造が同じでも、型としては別物なので
    // 関数に渡す際などにコンパイラが区別してくれます。
    
    // 中身へのアクセスはタプル同様にインデックスを使用
    println!("Origin X: {}", origin.0);
}
```

```rust-exec:tuple_structs.rs
Origin X: 0
```
