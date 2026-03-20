---
id: rust-modules-cargotoml
title: Cargo.toml への追加
level: 3
question:
  - Cargo.tomlファイルに記述する`0.8.5`のようなバージョン番号は、どのように選べば良いですか？
  - '`[dependencies]`以外にも、Cargo.tomlにはどんなセクションがありますか？'
  - 外部クレートを追加した後に、何かコマンドを実行する必要はありますか？
---

### Cargo.toml への追加

`Cargo.toml` の `[dependencies]` セクションに、使いたいクレートの名前とバージョンを記述します。例えば、乱数を生成する `rand` クレートを使う場合：

```toml
[dependencies]
rand = "0.8.5"
```
