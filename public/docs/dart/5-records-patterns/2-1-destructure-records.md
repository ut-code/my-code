---
id: dart-patterns-destructure-records
title: レコードの分解
level: 3
question:
  - レコードから直接変数に分解代入する方法はどう書きますか？
  - 名前付きレコードの分解時にプロパティ名と同じ変数名へバインドする省略記法（(:x, :y)）とは？
term:
  - レコード分解
---

### レコードの分解

```dart:destructure_records.dart
(String, int) getCoords() => ('Tokyo', 100);
({int x, int y}) getPoint() => (x: 10, y: 20);

void main() {
  // 位置レコードの分解
  final (city, population) = getCoords();
  print('都市: $city, 人口: $population 万人');

  // 名前付きレコードの分解
  final (:x, :y) = getPoint();
  print('座標: x=$x, y=$y');
}
```

```dart-exec:destructure_records.dart
都市: Tokyo, 人口: 100 万人
座標: x=10, y=20
```
