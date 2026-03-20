---
id: rust-structs-methods-struct-update
title: 構造体更新記法
level: 3
question:
  - user2を作成した後、user1はどのように変化しますか？
  - ..user1の構文は、コピーしているということですか？
  - 複数のフィールドだけを変更したい場合も、この構文を使えますか？
---

### 構造体更新記法

既存のインスタンスの値を元に、一部だけ変更した新しいインスタンスを作成する場合、`..` 構文を使用できます。

```rust
// user1のデータを元に、emailだけ変更したuser2を作成
let user2 = User {
    email: String::from("another@example.com"),
    ..user1 // 残りのフィールドはuser1と同じ値が入る
};
```
