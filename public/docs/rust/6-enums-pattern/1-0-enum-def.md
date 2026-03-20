---
id: rust-enums-pattern-enum-def
title: Enumの定義と値の保持
level: 2
question:
  - Enumとは何ですか？
  - Enumの各バリアントにデータを持たせるとはどういう意味ですか？
  - V4(u8, u8, u8, u8) の u8 はそれぞれ何を表していますか？
  - StringはRustの標準ライブラリの型ですか？
  - '#[derive(Debug)] は何のために必要ですか？'
---

## Enumの定義と値の保持

最も基本的なEnumの使い方は、C言語などと同様に「ありうる値の列挙」です。しかし、RustのEnumの真価は、**各バリアント（選択肢）にデータを持たせることができる**点にあります。

例えば、IPアドレスを表現する場合を考えてみましょう。IPアドレスにはV4とV6があり、それぞれ異なる形式のデータを持ちます。

```rust:ip_address.rs
#[derive(Debug)]
enum IpAddr {
    V4(u8, u8, u8, u8), // 4つのu8を持つ
    V6(String),         // Stringを持つ
}

fn main() {
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));

    println!("Home: {:?}", home);
    println!("Loopback: {:?}", loopback);
}
```

```rust-exec:ip_address.rs
Home: V4(127, 0, 0, 1)
Loopback: V6("::1")
```
