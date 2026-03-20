---
id: rust-intro-rustfmt
title: rustfmt (コードフォーマッタ)
level: 3
question:
  - '`rustfmt` を実行すると、コードはどのように変わるのですか？'
  - エディタで保存時に自動実行する設定はどのように行うのですか？
---

### `rustfmt` (コードフォーマッタ)

Go言語の `gofmt` のように、コードを自動整形します。

```bash
cargo fmt
```

多くのエディタ（VS Codeなど）では保存時に自動実行されるよう設定するのが一般的です。
