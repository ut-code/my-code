---
id: dart-collections-map
title: 'Map: キーと値のペア'
level: 3
question:
  - Mapのリテラル記法はどうなっていますか？
  - 存在しないキーにアクセスした場合に返る値は何ですか？
term:
  - 連想配列
  - ディクショナリ
---

### `Map`: キーと値のペア

波括弧 `{}` を使い、`key: value` 形式で記述します。

```dart:map_basics.dart
void main() {
  // Map<String, int>
  var scores = {
    'Alice': 95,
    'Bob': 80,
  };

  scores['Charlie'] = 88; // 要素の追加・更新
  print('Aliceの点数: ${scores['Alice']}');
  print('存在しないキー: ${scores['Dave']}'); // null が返る
}
```

```dart-exec:map_basics.dart
Aliceの点数: 95
存在しないキー: null
```
