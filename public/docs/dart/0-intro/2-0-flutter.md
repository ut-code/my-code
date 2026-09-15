---
id: dart-intro-flutter
title: DartとFlutter
level: 2
question:
  - DartとFlutterの関係はどうなっていますか？
  - Flutter以外の場所でもDartは使えますか？
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
