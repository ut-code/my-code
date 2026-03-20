---
id: rust-collections-strings-hashmap-basic
title: 基本的な操作
level: 3
question:
  - scores.insertでString::fromを使う必要があるのはなぜですか？直接文字列リテラルを使えないのですか？
  - getメソッドがOption<&V>を返すのは、Vecのgetと同じような理由ですか？
  - ハッシュマップの反復処理で「順序は保証されない」とはどういう意味ですか？毎回違う順序で出力される可能性があるということですか？
---

### 基本的な操作

```rust:hashmap_demo.rs
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    // 挿入
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    // 値の取得（getはOption<&V>を返す）
    let team_name = String::from("Blue");
    if let Some(score) = scores.get(&team_name) {
        println!("{}: {}", team_name, score);
    }

    // 反復処理（順序は保証されない）
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}
```

```rust-exec:hashmap_demo.rs
Blue: 10
Yellow: 50
Blue: 10
```
