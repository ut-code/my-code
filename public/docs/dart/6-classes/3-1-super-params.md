---
id: dart-classes-super-params
title: superパラメータと初期化子リストでのassert
level: 3
question:
  - 初期化子リスト内でassertを使うメリットは何ですか？
  - super.field 構文を使うとどのようにコードが短縮されますか？
term:
  - superパラメータ
  - assert初期化
---

### superパラメータと初期化子リストでのassert

初期化子リスト（コロン `:` に続く記述）では、フィールドの事前計算や `assert` による引数検証が可能です。また、親クラスへの引数転送には `super.field` が使えます。

```dart:super_params.dart
class Shape {
  final String type;
  Shape(this.type);
}

class Rectangle extends Shape {
  final double width;
  final double height;
  final double area;

  // 初期化子リストで面積計算、バリデーション、親クラス呼出
  Rectangle(this.width, this.height)
      : area = width * height,
        assert(width > 0, 'width は正の数である必要があります'),
        super('Rectangle');

  void info() => print('図形: $type, 幅: $width, 高さ: $height, 面積: $area');
}

void main() {
  final rect = Rectangle(5.0, 8.0);
  rect.info();
}
```

```dart-exec:super_params.dart
図形: Rectangle, 幅: 5.0, 高さ: 8.0, 面積: 40.0
```
