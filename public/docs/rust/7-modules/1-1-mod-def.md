---
id: rust-modules-mod-def
title: モジュールの基本定義 (mod)
level: 3
question:
  - '`mod`キーワードを使って定義したモジュールの中身は、なぜデフォルトで`main`関数から呼び出せないのですか？'
  - サブモジュールはいくつでも作れるのですか？
  - '`mod restaurant { ... }`のようにブロックで囲むのはなぜですか？'
  - モジュール内の関数は、モジュール内で定義しないと使えないのですか？
---

### モジュールの基本定義 (`mod`)

モジュールは `mod` キーワードを使って定義します。モジュールの中に、さらにモジュール（サブモジュール）を入れることも可能です。

まずは、1つのファイル内でモジュールを定義して、その構造を見てみましょう。

```rust:simple_module.rs
// "restaurant" という名前のモジュールを定義
mod restaurant {
    // モジュール内に関数を定義
    // 注意: デフォルトでは親モジュールからアクセスできません（後述）
    fn make_coffee() {
        println!("コーヒーを淹れます");
    }

    // サブモジュール
    mod front_of_house {
        fn add_to_waitlist() {
            println!("順番待ちリストに追加しました");
        }
    }
}

fn main() {
    // restaurant::make_coffee();
    // restaurant::front_of_house::add_to_waitlist();
}
```

```rust-exec:simple_module.rs
```

このコードはコンパイルに通りますが、`main` 関数から `make_coffee` などを呼び出そうとするとエラーになります。それは**可視性**の問題があるからです。
