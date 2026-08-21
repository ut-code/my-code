---
id: dart-class-extension-practice2
title: '練習問題2: Extensionを用いた文字列ユーティリティ'
level: 3
question:
  - Extensionのスコープ（ライブラリ内でのみ有効かエクスポート可能か）について教えてください。
  - 拡張メソッド内で元のオブジェクト（this）を変更することはできますか？
---

### 練習問題2: Extensionを用いた文字列ユーティリティ

`String` クラスに対して、特定の文字列操作を行う拡張メソッドを実装してください。

1. `extension StringUtils on String` を定義する。
   * ゲッター `bool get isEmail`: 文字列に `@` と `.` が含まれているかを簡易判定する。
   * メソッド `String mask({int visibleCount = 2})`: 先頭から `visibleCount` 文字だけ残し、以降を `*` でマスクした文字列を返す（文字数が `visibleCount` 以下の場合はそのまま返す）。
2. `main()` で `'user@example.com'` に対する `isEmail` の判定結果と、`mask()` によるマスク文字列（例: `'us**************'`）を出力する。

```dart:practice7_2.dart
// ここにコードを書いてください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice7_2.dart
```
