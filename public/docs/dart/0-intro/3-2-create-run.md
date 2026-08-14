---
id: dart-intro-create-run
title: プロジェクトの作成と実行
level: 3
question:
  - dart create コマンドで新規プロジェクトを作成する方法は？
  - プロジェクトの設定やライブラリ追加はどのファイルで行いますか？
term:
  - dart create
  - dart run
---

### プロジェクトの作成と実行

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
