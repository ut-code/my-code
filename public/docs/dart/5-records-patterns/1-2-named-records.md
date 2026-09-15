---
id: dart-records-named
title: 名前付きフィールド（Named Fields）
level: 3
question:
  - 名前付きフィールドを持つレコードの定義方法を教えてください。
  - レコード内で位置指定フィールドと名前付きフィールドを混在させることはできますか？
term:
  - 名前付きフィールド
---

### 名前付きフィールド（Named Fields）

波括弧 `{}` を使うことで、フィールドに名前を付けることができます。

```dart:named_records.dart
({String name, int age, bool isAdmin}) getDetailedUser() {
  return (name: 'Bob', age: 30, isAdmin: true);
}

void main() {
  final user = getDetailedUser();
  print('名前: ${user.name}');
  print('年齢: ${user.age}');
  print('管理者: ${user.isAdmin}');
}
```

```dart-exec:named_records.dart
名前: Bob
年齢: 30
管理者: true
```
