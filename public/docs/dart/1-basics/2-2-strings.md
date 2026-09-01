---
id: dart-basics-strings
title: 文字列と文字列補間
level: 3
question:
  - Dartで文字列補間（String Interpolation）はどう書きますか？
  - 複数行文字列（トリプルクォート）の使い方は？
term:
  - 文字列補間
  - 複数行文字列
---

### 文字列と文字列補間

Dartでは、文字列リテラル内に `$変数名` や `${式}` を埋め込むことができます。シングルクォート `'` とダブルクォート `"` のどちらでも記述可能です。

```dart:strings.dart
void main() {
  String language = 'Dart';
  int version = 3;

  // 文字列補間
  String greeting = 'Welcome to $language $version!';
  String calc = '1 + 1 = ${1 + 1}';

  // 複数行文字列（トリプルクォート）
  String multiLine = '''
1行目のテキスト
2行目のテキスト
3行目のテキスト''';

  print(greeting);
  print(calc);
  print(multiLine);
}
```

```dart-exec:strings.dart
Welcome to Dart 3!
1 + 1 = 2
1行目のテキスト
2行目のテキスト
3行目のテキスト
```
