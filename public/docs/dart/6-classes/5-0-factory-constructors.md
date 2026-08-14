---
id: dart-classes-factory
title: factory コンストラクタ（シングルトンやJSONパースの実装）
level: 2
question:
  - 通常のコンストラクタと factory コンストラクタの決定的な違いは何ですか？
  - factory コンストラクタを使ってシングルトンパターンを実装する方法を教えてください。
  - fromJson などのファクトリメソッドが factory として定義される理由は何ですか？
term:
  - factoryコンストラクタ
  - factory
  - ファクトリコンストラクタ
  - シングルトン
  - fromJson
---

## `factory` コンストラクタ（シングルトンやJSONパースの実装）

通常のコンストラクタは常にそのクラスの「新しいインスタンス」を生成しますが、**`factory` コンストラクタ** を使うと、コンストラクタ構文でありながら以下の制御が可能になります。

1. 既存のキャッシュ済みインスタンス（**[[シングルトン]]**）を返す。
2. サブクラスのインスタンスを生成して返す。
3. 条件に応じたインスタンス生成ロジック（JSONからのデシリアライズなど）をカプセル化する。

### 1. シングルトンパターンの実装

```dart:singleton_demo.dart
class DatabaseService {
  final String dbName;

  // プライベートな静的インスタンス
  static DatabaseService? _instance;

  // プライベートな通常コンストラクタ
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

### 2. JSONパース用 `fromJson` ファクトリ

```dart:factory_from_json.dart
class Product {
  final String id;
  final String title;
  final int price;

  const Product({
    required this.id,
    required this.title,
    required this.price,
  });

  // Map<String, dynamic> から Product を構築する factory コンストラクタ
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      title: json['title'] as String,
      price: json['price'] as int,
    );
  }
}

void main() {
  final jsonMap = {'id': 'p_01', 'title': 'メカニカルキーボード', 'price': 14800};
  final product = Product.fromJson(jsonMap);

  print('商品: ${product.title} (¥${product.price})');
}
```

```dart-exec:factory_from_json.dart
商品: メカニカルキーボード (¥14800)
```
