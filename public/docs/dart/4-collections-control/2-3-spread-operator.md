---
id: dart-collections-spread
title: 'スプレッド演算子（... / ...?）'
level: 3
question:
  - スプレッド演算子 (...) と Null認識スプレッド演算子 (...?) の使い分けは何ですか？
  - リストの途中に別のリストの要素を展開する方法は？
term:
  - スプレッド演算子
  - '...'
  - '...?'
---

### スプレッド演算子（`...` / `...?`）

既存のコレクションの全要素を別のコレクション内に展開して埋め込みます。対象が `null` になり得る場合は **`...?`（Null認識スプレッド演算子）** を使用します。

```dart:spread_operator.dart
void main() {
  var baseList = [1, 2];
  List<int>? extraList; // null

  var combined = [
    0,
    ...baseList,
    ...?extraList, // null なので展開を安全にスキップ
    3,
  ];

  print(combined);
}
```

```dart-exec:spread_operator.dart
[0, 1, 2, 3]
```
