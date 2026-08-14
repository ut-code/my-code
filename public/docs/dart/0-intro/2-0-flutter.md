---
id: dart-intro-flutter
title: DartとFlutter
level: 2
question:
  - DartとFlutterの関係はどうなっていますか？
  - Flutter以外の場所でもDartは使えますか？
  - Dart単体でサーバーサイドアプリケーションを書くことはできますか？
term:
  - Flutter
  - フラッター
  - マルチプラットフォーム
---

## DartとFlutter

[[Dart]]の存在を語る上で欠かせないのが、UIフレームワークである **[[Flutter]]** です。

Flutterは、単一のコードベースからiOS、Android、Web、macOS、Windows、Linux向けの高性能なアプリケーションをビルドできる[[マルチプラットフォーム]]フレームワークです。

```
+-------------------------------------------------------------+
|               Flutter Framework (Dart製UIライブラリ)            |
|   (Widgets, Rendering, Animation, Material, Cupertino)      |
+-------------------------------------------------------------+
|               Dart Platform (言語・ランタイム・標準ライブラリ)     |
|   (Core, Async, Collections, Math, I/O, Isolates)           |
+-------------------------------------------------------------+
|               Flutter Engine (C++ / Skia・Impeller)         |
+-------------------------------------------------------------+
```

### DartがFlutterに選ばれた理由

1. **高速な開発体験**: JITによるミリ秒単位のステートフル・ホットリロード。
2. **高い実行時パフォーマンス**: AOTコンパイルによるネイティブバイナリの生成と、UIの頻繁なオブジェクト生成・破棄に特化した世代別ガベージコレクション。
3. **宣言的UIとの親和性**: 特別なマークアップ言語（XMLやJSXなど）を必要とせず、Dart言語そのものでUIツリーをきれいに記述可能。

> [!NOTE]
> DartはFlutter専用言語ではありません。`dart:io` や `shelf` などのライブラリを用いてCLIツールやバックエンドAPIサーバーの開発にも活用されています。
