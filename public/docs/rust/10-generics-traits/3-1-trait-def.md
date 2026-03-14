---
id: rust-generics-traits-trait-def
title: トレイトの定義
level: 3
question:
  - '`pub trait Summary` の `pub` キーワードは何を意味しますか？'
  - なぜトレイトではメソッドのシグネチャだけを定義するのですか？
---

### トレイトの定義

ここでは、「情報を要約できる」という振る舞いを表す `Summary` トレイトを定義してみましょう。

```rust
pub trait Summary {
    fn summarize(&self) -> String; // メソッドのシグネチャのみ定義
}
```
