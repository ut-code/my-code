---
id: dart-intro-install
title: Dartのインストール
level: 2
question:
  - FlutterをインストールすればDart SDKも一緒に含まれますか？
  - Dart公式のパッケージマネージャは何ですか？
  - pubspec.yaml とは何をするファイルですか？
term:
  - Dart SDK
  - dart コマンド
  - pub
  - pubspec.yaml
---

## Dartのインストール

ローカル環境で[[Dart]]を動作させるには、**[[Dart SDK]]** をインストールします。

> [!TIP]
> 既に [[Flutter]] をインストールしている場合、Flutter SDKにDart SDKがバンドルされているため、個別のDartインストールは不要です。

### 1. インストール方法

* **macOS (Homebrew)**:
  ```bash
  brew tap dart-lang/dart
  brew install dart
  ```
* **Windows (Chocolatey / Scoop / Winget)**:
  ```bash
  winget install Dart.Dart-SDK
  ```
* **Linux (apt)**:
  ```bash
  sudo apt-get install dart
  ```

### 2. インストールの確認

ターミナルで `dart` コマンドを実行し、バージョンが表示されるか確認します。

```bash
$ dart --version
Dart SDK version: 3.x.x
```

### 3. プロジェクトの作成と実行

Dartでは、プロジェクト作成や依存関係管理、コード整形、テストなどのツールチェーンがすべて `dart` コマンドに統合されています。

```bash
# 新しいコンソールプロジェクトを作成
$ dart create my_dart_app

# プロジェクトディレクトリへ移動
$ cd my_dart_app

# プログラムの実行
$ dart run
Hello world: 42!
```

Dartのプロジェクト構成やライブラリの依存管理は、プロジェクトルートにある `pubspec.yaml` ファイルで行います。
