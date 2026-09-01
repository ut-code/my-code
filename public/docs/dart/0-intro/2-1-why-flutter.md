---
id: dart-intro-why-flutter
title: DartがFlutterに選ばれた理由
level: 3
question:
  - なぜFlutterはJavaScriptやC++ではなくDartを選んだのですか？
  - Dart単体でサーバーサイドアプリケーションを書くことはできますか？
term:
  - 宣言的UI
---

### DartがFlutterに選ばれた理由

1. **高速な開発体験**: JITによるミリ秒単位のステートフル・ホットリロード。
2. **高い実行時パフォーマンス**: AOTコンパイルによるネイティブバイナリの生成と、UIの頻繁なオブジェクト生成・破棄に特化した世代別ガベージコレクション。
3. **[[宣言的UI]]との親和性**: 特別なマークアップ言語（XMLやJSXなど）を必要とせず、Dart言語そのものでUIツリーをきれいに記述可能。

> [!NOTE]
> DartはFlutter専用言語ではありません。`dart:io` や `shelf` などのライブラリを用いてCLIツールやバックエンドAPIサーバーの開発にも活用されています。
