---
id: dart-collections-for
title: コレクション for
level: 3
question:
  - コレクション for を使ってリストを展開する例を教えてください。
  - コレクション for の中でコレクション if をネストさせることはできますか？
term:
  - コレクションfor
---

### コレクション `for`

ループを使って複数の要素を動的に展開してコレクションを構築します。

```dart:collection_for.dart
void main() {
  var numbers = [1, 2, 3];
  var stringList = [
    '#0',
    for (var n in numbers) '#$n',
  ];

  print(stringList);
}
```

```dart-exec:collection_for.dart
[#0, #1, #2, #3]
```
