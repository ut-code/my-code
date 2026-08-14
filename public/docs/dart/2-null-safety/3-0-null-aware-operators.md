---
id: dart-null-safety-null-aware-operators
title: 'Null認識演算子（?.、??、??=）'
level: 2
question:
  - ?. 演算子（オプショナルチェーン）の返り値の型は何になりますか？
  - ?? 演算子（Null合流演算子）はどう使いますか？
  - ??= 演算子はどのような動作をしますか？
term:
  - Null認識演算子
  - null認識演算子
  - オプショナルチェーン
  - '??'
  - '?.'
  - '??='
---

## Null認識演算子（`?.`、`??`、`??=`）

[[Dart]]には、Nullableな値を安全かつ簡潔に処理するための **[[Null認識演算子]]（Null-aware operators）** が用意されています。

### 1. 条件付きアクセス演算子 (`?.`)

対象が `null` でなければプロパティやメソッドにアクセスし、`null` であれば `null` を返します。

```dart:null_aware_access.dart
void main() {
  String? text;
  // text が null なので、length にアクセスせず null を返す
  int? length = text?.length;
  print('length: $length');

  text = 'Hello';
  length = text?.length;
  print('length: $length');
}
```

```dart-exec:null_aware_access.dart
length: null
length: 5
```

### 2. Null合流演算子 (`??`)

左辺が `null` でない場合は左辺の値を、左辺が `null` の場合は右辺のデフォルト値を返します（いわゆるElvis演算子やNullish coalescing演算子）。

```dart:null_coalescing.dart
void main() {
  String? userName;
  String displayName = userName ?? '名無しのユーザー';
  print('表示名: $displayName');

  userName = 'Alice';
  displayName = userName ?? '名無しのユーザー';
  print('表示名: $displayName');
}
```

```dart-exec:null_coalescing.dart
表示名: 名無しのユーザー
表示名: Alice
```

### 3. Null認識代入演算子 (`??=`)

変数が `null` の場合のみ、右辺の値を代入します。

```dart:null_aware_assignment.dart
void main() {
  int? count;
  count ??= 10; // count は null だったので 10 が代入される
  print('count: $count');

  count ??= 20; // count は既に 10 なので 20 は代入されない
  print('count: $count');
}
```

```dart-exec:null_aware_assignment.dart
count: 10
count: 10
```
