---
id: dart-classes-basics
title: クラスの定義とインスタンス化（newの省略）
level: 2
question:
  - なぜDartではnewキーワードを省略できるのですか？
  - コンストラクタで this.field を使う構文のメリットは何ですか？
  - メソッド内で this を明示する必要があるのはどのような場合ですか？
term:
  - クラス
  - class
  - インスタンス
  - new
  - メソッド
---

## クラスの定義とインスタンス化（`new`の省略）

[[Dart]]でオブジェクトの設計図となる **[[クラス]]（`class`）** を定義し、インスタンスを生成する基本的な構文を見てみましょう。

### 1. クラス定義とコンストラクタの糖衣構文

Dartでは、引数をそのままフィールドに代入する場合、`Point(this.x, this.y);` のように宣言するだけで初期化処理が完了します。

```dart:point_class.dart
class Point {
  // フィールド（インスタンス変数）
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
  // new キーワードは完全に省略可能
  final p1 = Point(3.0, 4.0);
  p1.printCoordinates();
}
```

```dart-exec:point_class.dart
Point(3.0, 4.0)
```

> [!NOTE]
> Dart 2以降、インスタンス生成時の `new` キーワードは省略するのが公式スタイルガイドの標準です（`new Point(...)` と書くことも文法上は可能ですが、通常は書きません）。
