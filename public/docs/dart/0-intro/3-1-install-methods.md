---
id: dart-intro-install-methods
title: インストール方法
level: 3
question:
  - macOSやWindowsでのDartのインストールコマンドは何ですか？
  - インストールが成功したか確認する方法を教えてください。
term:
  - Homebrew
  - Chocolatey
---

### インストール方法

主要なOSでのインストール手順は以下の通りです。

* **macOS (Homebrew)**:
  ```bash
  brew tap dart-lang/dart
  brew install dart
  ```
* **Windows (Winget / Chocolatey)**:
  ```bash
  winget install Dart.Dart-SDK
  ```
* **Linux (apt)**:
  ```bash
  sudo apt-get install dart
  ```

ターミナルで `dart` コマンドを実行し、バージョンが表示されれば完了です。

```bash
$ dart --version
Dart SDK version: 3.x.x
```
