---
id: dart-classes-basics
title: クラスの定義とインスタンス化（newの省略）
level: 2
question:
  - なぜDartではnewキーワードを省略できるのですか？
  - コンストラクタで this.field を使う構文のメリットは何ですか？
term:
  - クラス
  - class
  - インスタンス
  - new
  - メソッド
---

## クラスの定義とインスタンス化（`new`の省略）

[[Dart]]でオブジェクトの設計図となる **[[クラス]]（`class`）** を定義し、インスタンスを生成する基本的な構文を見てみましょう。

Dartでは、引数をそのままフィールドに代入する場合、`Point(this.x, this.y);` のように宣言するだけで初期化処理が完了します。また、インスタンス生成時の `new` は省略するのが標準です。

```dart:point_class.dart
class Point {
  // フィールド
  final double x;
  final double y;

  // コンストラクタ（糖衣構文 this.x, this.y）
  Point(this.x, this.y);

  // メソッド
  void printCoordinates() {
    print('Point($x, $y)');
  }
}

void main() {
  // new キーワードは省略可能
  final p1 = Point(3.0, 4.0);
  p1.printCoordinates();
}
```

```dart-exec:point_class.dart
Point(3.0, 4.0)
```
