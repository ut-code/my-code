---
id: dart-classes-initializer-super
title: '初期化子リスト（:）と super の呼び出し'
level: 2
question:
  - 初期化子リストとコンストラクタ本体の実行順序はどうなっていますか？
  - superパラメータ（super.field）を使うとコードがどう短縮されますか？
  - 初期化子リスト内でassertを使って引数を検証する方法を教えてください。
term:
  - 初期化子リスト
  - super
  - superパラメータ
  - 継承
---

## 初期化子リスト（`:`）と `super` の呼び出し

### 1. 初期化子リスト（Initializer List）

コンストラクタ本体 `{}` が実行される前に、フィールドの計算や `assert` による引数検証を行うには、引数リストの後にコロン `:` を付けて **[[初期化子リスト]]** を記述します。

```dart:initializer_list.dart
class Rectangle {
  final double width;
  final double height;
  final double area;

  // 初期化子リストで面積 (area) を事前計算
  Rectangle(this.width, this.height)
      : area = width * height,
        assert(width > 0, 'width は正の数である必要があります'),
        assert(height > 0, 'height は正の数である必要があります');

  void display() {
    print('幅: $width, 高さ: $height, 面積: $area');
  }
}

void main() {
  final rect = Rectangle(5.0, 8.0);
  rect.display();
}
```

```dart-exec:initializer_list.dart
幅: 5.0, 高さ: 8.0, 面積: 40.0
```

### 2. 親クラスのコンストラクタ呼び出し (`super` / `super.field`)

子クラスのコンストラクタから親クラスのコンストラクタに値を渡すには、初期化子リストで `: super(...)` を呼び出すか、Dart 2.17で追加された **`super.field`（Super Parameters）** を使います。

```dart:super_params.dart
class Person {
  final String name;
  Person(this.name);
}

class Employee extends Person {
  final String department;

  // super.name で親クラスのコンストラクタへ引数を直接転送
  Employee(super.name, this.department);

  void info() => print('社員: $name, 部署: $department');
}

void main() {
  final emp = Employee('Charlie', '開発部');
  emp.info();
}
```

```dart-exec:super_params.dart
社員: Charlie, 部署: 開発部
```
