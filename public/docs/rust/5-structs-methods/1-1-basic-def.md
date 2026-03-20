---
id: rust-structs-methods-basic-def
title: 基本的な定義
level: 3
question:
  - structキーワードは何のために使うのですか？
  - User構造体のフィールドを定義する際、String型とu64型の違いは何ですか？
  - インスタンス化の際のフィールドの順番は、定義と異なっても本当に問題ないですか？
  - user1変数にmutキーワードがないとどうなりますか？
  - なぜ特定のフィールドだけを可変にできないのですか？
---

### 基本的な定義

C言語の `struct` や、メソッドを持たないクラスのようなものです。フィールド名と型を定義します。

```rust:user_struct.rs
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    // インスタンス化
    // フィールドの順番は定義と異なっても構いません
    let mut user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    // ドット記法でフィールドにアクセス
    user1.email = String::from("another@example.com");

    println!("User: {}, Email: {}", user1.username, user1.email);
}
```

```rust-exec:user_struct.rs
User: someusername123, Email: another@example.com
```

> **注意**: Rustでは、インスタンス全体が可変（`mut`）か不変かのどちらかになります。特定のフィールドだけを可変（`mut`）にすることはできません。
