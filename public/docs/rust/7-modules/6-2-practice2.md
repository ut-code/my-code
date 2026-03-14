---
id: rust-modules-practice2
title: 練習問題2：パスと可視性の修正
level: 3
question:
  - '`connect();`が`main`関数から呼び出せないのは、なぜですか？'
  - '`server`モジュールの中から親モジュールの`connect`関数を呼び出すには、どのように修正すれば良いですか？'
  - '`connect`関数と`server`モジュールは、それぞれどこに`pub`をつければ良いですか？'
---

### 練習問題2：パスと可視性の修正

以下のコードは可視性の設定とパスの指定が誤っているためコンパイルできません。修正して正常に「ネットワーク接続完了」と表示されるようにしてください。

```rust:practice8_2.rs
mod network {
    fn connect() {
        println!("ネットワーク接続完了");
    }
    
    mod server {
        fn start() {
            // 親モジュールのconnectを呼びたい
            connect(); // ここが間違っている
        }
    }
}

fn main() {
    // ネットワークモジュールのconnectを呼びたい
    connect(); // ここも間違っている
}
```

```rust-exec:practice8_2.rs
```
