---
id: rust-enums-pattern-option
title: Option<T> 型（Null安全性の核心）
level: 2
question:
  - Nullが存在しないとは、他の言語のnullやnilとは何が違うのですか？
  - Option<T> の T は任意の型とありますが、これはどういう意味ですか？
  - SomeとNoneは大文字で始まるので、Enumのバリアント名ですか？
---

## Option\<T\> 型（Null安全性の核心）

Rustには、他の多くの言語にある **Null（ヌル）が存在しません**。
その代わり、標準ライブラリで定義された `Option<T>` というEnumを使用します。これは「値が存在するかもしれないし、しないかもしれない」ことを表現します。

`Option<T>` は以下のように定義されています（概念図）：

```rust
enum Option<T> {
    Some(T), // 値がある場合。Tは任意の型。
    None,    // 値がない場合。
}
```
