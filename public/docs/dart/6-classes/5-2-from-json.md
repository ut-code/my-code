---
id: dart-classes-from-json
title: JSONパース用 fromJson ファクトリ
level: 3
question:
  - fromJson ファクトリコンストラクタの典型的なシグネチャを教えてください。
  - Mapから安全にキャストしてフィールドを初期化する書き方は？
term:
  - fromJson
  - JSONパース
---

### JSONパース用 `fromJson` ファクトリ

`Map<String, dynamic>` からオブジェクトを生成する `fromJson` を `factory` コンストラクタとして定義するのがDartのデファクトスタンダードです。

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
