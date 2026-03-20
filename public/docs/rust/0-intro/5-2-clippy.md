---
id: rust-intro-clippy
title: clippy (リンタ)
level: 3
question:
  - '`clippy` はどのようなパフォーマンスの改善案を提案してくれますか？'
  - 「Idiomatic Rust」とはどういう意味ですか？
  - Clippyの警告に従うだけでRustの理解が深まるのはなぜですか？
---

### `clippy` (リンタ)

単なるスタイルチェックだけでなく、パフォーマンスの改善案や、Rustらしい書き方（Idiomatic Rust）を提案してくれます。

```bash
cargo clippy
```

例えば、無駄な計算や非推奨なAPIの使用などを指摘してくれるため、学習中はこのコマンドの警告に従うだけでRustの理解が深まります。
