---
id: dart-collections-map-where
title: where と map による抽出・変換
level: 3
question:
  - where メソッドと map メソッドの役割の違いは何ですか？
  - map の結果を List に変換するにはどうすればよいですか？
term:
  - where
  - map
  - toList
---

### `where` と `map` による抽出・変換

* `where`: 条件を満たす（コールバックが `true` を返す）要素のみを抽出します。
* `map`: 各要素を変換関数で別の値に写像します。
* `toList()`: 遅延評価される `Iterable` を `List` に確定します。

```dart:map_where.dart
void main() {
  final numbers = [1, 2, 3, 4, 5, 6];

  // 偶数だけを抽出し、それぞれを2乗してListに変換
  final result = numbers
      .where((n) => n.isEven)
      .map((n) => n * n)
      .toList();

  print('元のリスト: $numbers');
  print('変換後: $result');
}
```

```dart-exec:map_where.dart
元のリスト: [1, 2, 3, 4, 5, 6]
変換後: [4, 16, 36]
```
