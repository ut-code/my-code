---
id: rust-enums-pattern-9-if-let
title: if let 記法
level: 2
---

## if let 記法

`match` は強力ですが、**「ある1つのパターンだけ処理して、他は全部無視したい」**という場合には記述が長くなりがちです。
そのような場合に `if let` が便利です。

これは以下の `match` のシンタックスシュガー（糖衣構文）です。

```rust
// matchを使う場合（冗長）
let config = Some("config_value");
match config {
    Some(val) => println!("設定値: {}", val),
    _ => (), // 何もしない
}
```

これと同じことを `if let` で書くと以下のようになります。

```rust:if_let_demo.rs
fn main() {
    let config = Some("config_value");
    let missing: Option<&str> = None;

    // 「もし config が Some(val) というパターンにマッチするならブロックを実行」
    if let Some(val) = config {
        println!("設定値があります: {}", val);
    }

    // else も使えます
    if let Some(val) = missing {
        println!("設定値: {}", val);
    } else {
        println!("設定値がありません");
    }
}
```

```rust-exec:if_let_demo.rs
設定値があります: config_value
設定値がありません
```

`if let` を使うとコードが短くなりますが、`match` が強制する「網羅性チェック」の恩恵は失われます。状況に応じて使い分けましょう。
