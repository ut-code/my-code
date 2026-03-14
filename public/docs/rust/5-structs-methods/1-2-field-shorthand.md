---
id: rust-structs-methods-field-shorthand
title: フィールド初期化省略記法
level: 3
question:
  - フィールド初期化省略記法は、どのような場合に便利ですか？
  - 'email: emailとemail、どちらの書き方でも同じ動作になりますか？'
  - JavaScriptを知らない場合、どのようなイメージを持てばよいですか？
---

### フィールド初期化省略記法

関数引数や変数の名前がフィールド名と同じ場合、記述を省略できます。これはJavaScriptのオブジェクト定義に似ています。

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,      // email: email と同じ
        username,   // username: username と同じ
        active: true,
        sign_in_count: 1,
    }
}
```
