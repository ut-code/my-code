---
id: dart-collections-list
title: 'List: 順序付き配列'
level: 3
question:
  - Listのリテラル記法はどうなっていますか？
  - 要素の追加やインデックスアクセスの方法を教えてください。
term:
  - 配列
  - リスト
---

### `List`: 順序付き配列

角括弧 `[]` を使ってリテラルを定義します。

```dart:list_basics.dart
void main() {
  // 型推論により List<String> になる
  var fruits = ['apple', 'banana', 'orange'];
  
  fruits.add('grape');
  print('要素数: ${fruits.length}');
  print('0番目: ${fruits[0]}');
  print('全要素: $fruits');
}
```

```dart-exec:list_basics.dart
要素数: 4
0番目: apple
全要素: [apple, banana, orange, grape]
```
