---
id: rust-modules-8-cargotoml
title: Cargo.toml への追加
level: 3
---

### Cargo.toml への追加

`Cargo.toml` の `[dependencies]` セクションに、使いたいクレートの名前とバージョンを記述します。例えば、乱数を生成する `rand` クレートを使う場合：

```toml
[dependencies]
rand = "0.8.5"
```
