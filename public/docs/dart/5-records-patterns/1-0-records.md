---
id: dart-records-intro
title: レコード（Records）による複数戻り値の実現
level: 2
question:
  - レコードとクラス（Class）の違いは何ですか？
  - 位置指定フィールドと名前付きフィールドを持つレコードはどう書きますか？
  - レコードのフィールド値を取得するための構文（$1, $2, フィールド名）を教えてください。
term:
  - レコード
  - Records
  - record
  - タプル
---

## レコード（Records）による複数戻り値の実現

**[[レコード]]（Records）** は、複数の値を1つにまとめることができる匿名かつ不変（イミュータブル）な集約型（いわゆるタプル）です。

専用のクラスを定義することなく、関数から複数の値を型安全に返すことができます。

### 1. 位置指定フィールド（Positional Fields）

丸括弧 `()` で値を囲むことでレコードを作成します。各フィールドには `$1`, `$2` でアクセスします。

```dart:positional_records.dart
// (String, int) 型のレコードを返す関数
(String, int) getUserInfo() {
  return ('Alice', 25);
}

void main() {
  final user = getUserInfo();
  print('名前 (\$1): ${user.$1}');
  print('年齢 (\$2): ${user.$2}');
}
```

```dart-exec:positional_records.dart
名前 ($1): Alice
年齢 ($2): 25
```

### 2. 名前付きフィールド（Named Fields）

波括弧 `{}` を使うことで、フィールドに名前を付けることができます。

```dart:named_records.dart
// 名前付きフィールドを持つレコード型
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

> [!NOTE]
> レコードは値の同一性（Equality）を持ちます。同じフィールドと値を持つ2つのレコードは `==` で比較した際に `true` になります。
