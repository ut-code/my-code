---
id: rust-modules-2-pub
title: 可視性と pub キーワード
level: 2
---

## 可視性と `pub` キーワード

Rustのモジュールシステムの最大の特徴は、**「すべてのアイテム（関数、構造体、モジュールなど）は、デフォルトで非公開（private）」**であるという点です。

  * **非公開:** 定義されたモジュール自身と、その子モジュールからのみアクセス可能。親モジュールからは見えません。
  * **公開 (`pub`):** 親モジュールや外部からアクセス可能になります。

親モジュール（この場合は `main` 関数がいるルート）から子モジュールの中身を使うには、明示的に `pub` をつける必要があります。

```rust:simple_module_with_pub.rs
mod restaurant {
    // pubがないので、restaurantモジュール内からしか呼べない
    fn make_coffee() {
        println!("コーヒーを淹れます");
    }

    // pubをつけてサブモジュールも公開
    pub mod front_of_house {
        // ここも公開関数にする
        pub fn add_to_waitlist() {
            println!("順番待ちリストに追加しました");
        }
    }
}
fn main() {
    // これで呼び出せるようになる
    restaurant::front_of_house::add_to_waitlist();

    // restaurant::make_coffee();
}
```

```rust-exec:simple_module_with_pub.rs
順番待ちリストに追加しました
```
