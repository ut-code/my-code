---
id: rust-generics-traits-generic-struct
title: ジェネリックな構造体
level: 3
question:
  - >-
    `Point { x: 5, y: 4.0 }` がコンパイルエラーになるのは理解できますが、このような異なる型の値を持つ `Point`
    を作りたい場合はどうすれば良いですか？
  - '`MixedPoint` のように複数の型パラメータを使うのはどのような場合が考えられますか？'
  - 構造体にジェネリクスを使うことで、通常の構造体と比べて何かパフォーマンスの違いはありますか？
---

### ジェネリックな構造体

構造体のフィールドの型をジェネリックにすることも可能です。

```rust:generic_struct.rs
// T型のxとyを持つPoint構造体
struct Point<T> {
    x: T,
    y: T,
}

// 異なる型を持たせたい場合は複数のパラメータを使う
struct MixedPoint<T, U> {
    x: T,
    y: U,
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
    
    // 以下の行はコンパイルエラーになる（xとyが同じTである必要があるため）
    // let error = Point { x: 5, y: 4.0 }; 

    let mixed = MixedPoint { x: 5, y: 4.0 };

    println!("Int Point: x = {}, y = {}", integer.x, integer.y);
    println!("Mixed Point: x = {}, y = {}", mixed.x, mixed.y);
}
```

```rust-exec:generic_struct.rs
Int Point: x = 5, y = 10
Mixed Point: x = 5, y = 4
```
