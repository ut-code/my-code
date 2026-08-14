---
id: dart-async-future-practice2
title: '練習問題2: 複数の非同期処理の並行実行'
level: 3
question:
  - Future.wait で一部のFutureが失敗した場合の挙動はどうなりますか？
  - 並行実行と逐次実行の処理時間の違いを教えてください。
---

### 練習問題2: 複数の非同期処理の並行実行

複数のAPIエンドポイントから並行してデータを取得し、まとめるプログラムを作成してください。

1. 以下の2つの非同期関数を作成する。
   * `Future<String> fetchConfig()`: 100ミリ秒後に `'AppConfig: v2.0'` を返す。
   * `Future<List<String>> fetchNotifications()`: 150ミリ秒後に `['メンテ予告', '新着メッセージ']` を返す。
2. `main()` 内で `Future.wait` を使用して両方を並行して実行・待機する。
3. 取得した設定と通知一覧を整形して画面に出力する。

```dart:practice9_2.dart
// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice9_2.dart
```
