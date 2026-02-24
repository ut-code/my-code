---
id: rust-generics-traits-std-traits
title: 代表的な標準トレイト
level: 2
---

## 代表的な標準トレイト

Rustには、すべてのRustプログラマが知っておくべき標準トレイトがいくつかあります。これらはしばしば `#[derive(...)]` 属性を使って自動的に実装されます。

1.  **`Debug`**: `{:?}` でフォーマット出力するためのトレイト。開発中のデバッグ出力に必須です。
2.  **`Display`**: `{}` でフォーマット出力するためのトレイト。ユーザー向けの表示に使います。自動導出（derive）はできず、手動実装が必要です。
3.  **`Clone`**: `.clone()` メソッドで明示的にディープコピー（またはそれに準ずる複製）を作成するためのトレイト。
4.  **`Copy`**: 値がビット単位のコピーで複製できることを示すマーカートレイト。これが実装されている型（`i32`など）は、代入しても所有権が移動（Move）せず、コピーされます。

<!-- end list -->

```rust:std_traits.rs
// Debug, Clone, Copyを自動導出
#[derive(Debug, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 10, y: 20 };
    
    // Copyトレイトがあるので、p1はmoveされない。コピーされる。
    let p2 = p1; 

    // Debugトレイトがあるので {:?} が使える
    println!("p1: {:?}", p1); 
    println!("p2: {:?}", p2);

    // Cloneトレイトがあるので明示的に呼ぶこともできる（Copyがある場合、動作はCopyと同じになることが多い）
    let p3 = p1.clone();
    println!("p3: {:?}", p3);
}
```

```rust-exec:std_traits.rs
p1: Point { x: 10, y: 20 }
p2: Point { x: 10, y: 20 }
p3: Point { x: 10, y: 20 }
```

> **注意:** `String` や `Vec<T>` などのヒープ領域へのポインタを持つ型は、所有権のルール上、安易に `Copy` を実装できません（二重解放エラーになるため）。それらは `Clone` のみを実装します。
