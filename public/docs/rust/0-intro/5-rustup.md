---
id: rust-intro-5-rustup
title: rustup のインストール
level: 3
---

### `rustup` のインストール

Rustのバージョンマネージャである `rustup` を使用してインストールするのが標準的です。

macOS / Linux / WSL (Windows Subsystem for Linux) の場合：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windowsの場合：
公式サイト（rust-lang.org）から `rustup-init.exe` をダウンロードして実行します（C++ビルドツールが必要になる場合があります）。

インストール後、以下のコマンドでバージョンが表示されれば成功です。

```bash
rustc --version
cargo --version
```
