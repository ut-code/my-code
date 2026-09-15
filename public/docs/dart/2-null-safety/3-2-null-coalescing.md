---
id: dart-null-safety-null-coalescing
title: Null合流演算子（??）
level: 3
question:
  - ?? 演算子と三項演算子の使い分けはどうなりますか？
  - ?? 演算子を連続してチェーンさせることはできますか？
term:
  - Null合流演算子
  - '??'
  - デフォルト値
---

### Null合流演算子（`??`）

左辺が `null` でない場合は左辺の値を、`null` の場合は右辺のデフォルト値を返します。

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
