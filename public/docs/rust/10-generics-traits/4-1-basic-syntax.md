---
id: rust-generics-traits-basic-syntax
title: 基本的な構文
level: 3
question:
  - '`notify` 関数の糖衣構文と `notify_formal` 関数の正式な構文、どちらを使うのが一般的ですか？'
  - '`&impl Summary` と `&T` の引数表記で、内部的に何か違いはありますか？'
---

### 基本的な構文

以下の関数は、引数 `item` が `Summary` トレイトを実装していることを要求します。

```rust
// 糖衣構文（Syntactic Sugar）
fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

// 正式なトレイト境界の構文
fn notify_formal<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```
