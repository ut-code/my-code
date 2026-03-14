---
id: rust-collections-strings-string-str
title: String と &str の違い（復習）
level: 3
question:
  - Stringと&strの「所有権」や「ヒープ上」「参照」という言葉の意味を、もっと簡単に教えてもらえますか？
  - Stringと&strはそれぞれどのような時に使うのが適切ですか？
---

### `String` と `&str` の違い（復習）

  * **`String`**: 所有権を持つ、伸長可能な、ヒープ上の文字列（`Vec<u8>` のラッパー）。
  * **`&str` (文字列スライス)**: どこか（バイナリ領域やヒープ領域）にある文字列データへの参照。
