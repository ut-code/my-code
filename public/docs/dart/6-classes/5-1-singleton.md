---
id: dart-classes-singleton
title: シングルトンパターンの実装
level: 3
question:
  - factory コンストラクタを使ってシングルトンパターンを実装する方法を教えてください。
  - identical() 関数の役割は何ですか？
term:
  - シングルトン
  - identical
---

### シングルトンパターンの実装

`factory` コンストラクタを使って、常に同一のプライベート静的インスタンスを返却することで、シングルトンをエレガントに実装できます。

```dart:singleton_demo.dart
class DatabaseService {
  final String dbName;
  static DatabaseService? _instance;

  DatabaseService._internal(this.dbName);

  // factory コンストラクタ: 常に同一のインスタンスを返す
  factory DatabaseService({String dbName = 'main.db'}) {
    _instance ??= DatabaseService._internal(dbName);
    return _instance!;
  }
}

void main() {
  final db1 = DatabaseService();
  final db2 = DatabaseService();

  print('同一インスタンスか: ${identical(db1, db2)}');
}
```

```dart-exec:singleton_demo.dart
同一インスタンスか: true
```
