---
id: dart-patterns-destructure-collections
title: List と Map の分解
level: 3
question:
  - リストの分解時に不要な要素をスキップするワイルドカード（_）の使い方は？
  - Map の要素をパターン分解して型注釈付きで変数に抽出する方法を教えてください。
term:
  - リスト分解
  - マップ分解
  - ワイルドカード
---

### List と Map の分解

リストの要素数や中身に一致するパターンを使って値を抽出できます。不要な要素は `_`（ワイルドカード）で無視できます。

```dart:destructure_collections.dart
void main() {
  // List の分解
  final numbers = [1, 2, 3, 4];
  final [first, second, _, fourth] = numbers;
  print('1番目: $first, 2番目: $second, 4番目: $fourth');

  // Map の分解
  final json = {'id': 'user_123', 'status': 'active'};
  final {'id': String userId, 'status': String userStatus} = json;
  print('ユーザーID: $userId, ステータス: $userStatus');
}
```

```dart-exec:destructure_collections.dart
1番目: 1, 2番目: 2, 4番目: 4
ユーザーID: user_123, ステータス: active
```
