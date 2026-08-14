---
id: dart-functions-positional-params
title: '位置指定オプショナル引数（[]）'
level: 3
question:
  - 位置指定オプショナル引数の定義構文はどう書きますか？
  - 名前付き引数と位置指定オプショナル引数を同時に使うことはできますか？
term:
  - 位置指定引数
  - オプショナル引数
---

### 位置指定オプショナル引数（`[]`）

引数を `[]` で囲むと、順番通りのオプショナル引数を定義できます。

```dart:optional_positional.dart
String formatMessage(String from, String msg, [String? appName = 'MyChat']) {
  return '[$appName] $from: $msg';
}

void main() {
  print(formatMessage('Alice', 'Hello'));
  print(formatMessage('Bob', 'Hi', 'FlutterApp'));
}
```

```dart-exec:optional_positional.dart
[MyChat] Alice: Hello
[FlutterApp] Bob: Hi
```
