---
id: rust-structs-methods-10-associated-functions
title: 関連関数 (Associated Functions)
level: 3
---

### 関連関数 (Associated Functions)

`impl`ブロックの中で、第1引数に `self` を取らない関数も定義できます。これらはインスタンスではなく、型そのものに関連付けられた関数です。
他言語での「静的メソッド（Static Method）」に相当します。

最も一般的な用途は、コンストラクタのような役割を果たす初期化関数の作成です。Rustには `new` というキーワードはありませんが、慣習として `new` という名前の関連関数をよく作ります。

```rust:associated_fn.rs
#[derive(Debug)]
struct Circle {
    radius: f64,
}

impl Circle {
    // 関連関数（selfがない）
    // コンストラクタのように振る舞う
    fn new(radius: f64) -> Circle {
        Circle { radius }
    }
    
    // メソッド（selfがある）
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

fn main() {
    // 関連関数の呼び出しは :: を使う
    let c = Circle::new(2.0);
    
    println!("Circle radius: {}, area: {}", c.radius, c.area());
}
```

```rust-exec:associated_fn.rs
Circle radius: 2, area: 12.56636
```
