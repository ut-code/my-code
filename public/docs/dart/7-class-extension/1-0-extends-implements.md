---
id: dart-classes-extends-implements
title: extends（継承）と implements（インターフェース実装）の違い
level: 2
question:
  - なぜDartには interface キーワードが別途不要だったのですか？
  - implements を使った場合、親クラスの実装コードは引き継がれますか？
  - 多重継承が禁止されている一方で implements を複数指定できる理由は何ですか？
term:
  - extends
  - 継承
  - implements
  - 暗黙的インターフェース
  - インターフェース
  - ''
---

## `extends`（継承）と `implements`（インターフェース実装）の違い

[[Dart]]では、すべてのクラスが自動的に **[[暗黙的インターフェース]]（Implicit Interface）** を定義しています。これにより、任意のクラスを `implements` の対象として利用できます。

### 1. `extends` (単一継承)

親クラスの実装（メソッドの処理やフィールド）をそのまま引き継ぎます。Dartでは多重継承（複数のクラスを `extends` すること）はできません。

### 2. `implements` (インターフェース実装)

親クラスの「型のシグネチャ（メソッド名や引数・戻り値の型）」だけを満たすことを約束します。親クラスの実装コードは**一切引き継がれず、すべてのメソッドを再定義（`@override`）する必要があります**。カンマ区切りで複数のインターフェースを実装可能です。

```dart:extends_implements.dart
class Animal {
  void speak() {
    print('動物が鳴きます');
  }
}

// 1. extends: 実装を引き継ぎ、必要に応じてオーバーライド
class Dog extends Animal {
  @override
  void speak() {
    print('ワンワン！');
  }
}

// 2. implements: 型だけを流用し、全メソッドを自前で再実装
class RobotDog implements Animal {
  @override
  void speak() {
    print('ビープ！ワンワン (電子音)');
  }
}

void makeNoise(Animal animal) {
  animal.speak();
}

void main() {
  makeNoise(Dog());
  makeNoise(RobotDog());
}
```

```dart-exec:extends_implements.dart
ワンワン！
ビープ！ワンワン (電子音)
```
