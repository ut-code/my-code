---
id: dart-records-positional
title: 位置指定フィールド（Positional Fields）
level: 3
question:
  - 位置指定フィールドへのアクセス方法（$1, $2）はどう書きますか？
  - 位置指定フィールドの型定義の構文を教えてください。
term:
  - 位置指定フィールド
  - '$1'
  - '$2'
---

### 位置指定フィールド（Positional Fields）

丸括弧 `()` で値を囲むことでレコードを作成します。各フィールドには `$1`, `$2` でアクセスします。

```dart:positional_records.dart
(String, int) getUserInfo() {
  return ('Alice', 25);
}

void main() {
  final user = getUserInfo();
  print('名前 (\$1): ${user.$1}');
  print('年齢 (\$2): ${user.$2}');
}
```

```dart-exec:positional_records.dart
名前 ($1): Alice
年齢 ($2): 25
```
