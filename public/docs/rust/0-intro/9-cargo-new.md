---
id: rust-intro-9-cargo-new
title: プロジェクトの作成 (cargo new)
level: 3
---

### プロジェクトの作成 (`cargo new`)

新しいプロジェクトを作成します。

```bash
cargo new hello_cargo
cd hello_cargo
```

このコマンドにより、以下のディレクトリ構造が生成されます。

  * **`Cargo.toml`**: パッケージのマニフェストファイル（依存関係やメタデータを記述）。
  * **`src/main.rs`**: ソースコード。
  * **`.gitignore`**: Gitの設定ファイルも自動生成されます。
