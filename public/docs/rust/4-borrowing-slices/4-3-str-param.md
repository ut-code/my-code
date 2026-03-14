---
id: rust-borrowing-slices-str-param
title: 引数としての &str
level: 3
question:
  - なぜ関数の引数として&Stringより&strを使う方が柔軟性が高いのですか？
  - String型の変数を&strとして関数に渡すにはどうすればよいですか？
---

### 引数としての `&str`

関数で文字列を受け取る際、`&String` よりも `&str` を使う方が柔軟性が高まります。なぜなら、`&str` を引数にすれば、`String` も `&str`（リテラルなど）も両方受け取れるからです。

```rust
// この定義の方が汎用的
fn first_word(s: &str) -> &str {
    // 実装...
    &s[..] // 仮の実装
}
```
