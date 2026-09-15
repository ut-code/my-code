---
id: dart-null-safety-null-assignment
title: Null認識代入演算子（??=）
level: 3
question:
  - ??= 演算子は変数が null でない場合はどのような動作をしますか？
  - ??= 演算子を使ったキャッシュ初期化パターンの書き方は？
term:
  - Null認識代入
  - '??='
---

### Null認識代入演算子（`??=`）

変数が `null` の場合のみ、右辺の値を代入します。

```dart:null_aware_assignment.dart
void main() {
  int? count;
  count ??= 10; // null なので 10 を代入
  print('count: $count');

  count ??= 20; // 既に 10 なので 20 は代入されない
  print('count: $count');
}
```

```dart-exec:null_aware_assignment.dart
count: 10
count: 10
```
