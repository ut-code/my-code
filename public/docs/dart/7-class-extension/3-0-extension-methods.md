---
id: dart-classes-extensions
title: Extension（拡張メソッド）による既存クラスへの機能追加
level: 2
question:
  - 拡張メソッドを使うと標準ライブラリのクラス（Stringやintなど）にメソッドを追加できますか？
  - 拡張メソッドの定義構文はどう書きますか？
term:
  - Extension
  - 拡張メソッド
  - extension
  - extension on
---

## Extension（拡張メソッド）による既存クラスへの機能追加

**[[Extension]]（拡張メソッド）** を使うと、既存のクラス（Dartの組み込み型やサードパーティ製ライブラリのクラス）のソースコードを変更することなく、新しいメソッドやゲッター、演算子を追加できます。

構文は `extension ExtensionName on TargetType { ... }` です。

```dart:extension_methods.dart
// String クラスに拡張メソッドを追加
extension StringExtensions on String {
  // ゲッター: 先頭文字を大文字にする
  String get capitalize {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }

  // メソッド: 安全に整数に変換する
  int? toIntOrNull() => int.tryParse(this);
}

void main() {
  String word = 'flutter';
  print('capitalize: ${word.capitalize}');

  String numStr = '42';
  print('toIntOrNull: ${numStr.toIntOrNull()}');
}
```

```dart-exec:extension_methods.dart
capitalize: Flutter
toIntOrNull: 42
```
