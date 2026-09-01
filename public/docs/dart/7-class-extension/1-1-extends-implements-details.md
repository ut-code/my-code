---
id: dart-classes-extends-implements-details
title: 単一継承と暗黙的インターフェースの使い分け
level: 3
question:
  - implements を使った場合、親クラスの実装コードは引き継がれますか？
  - 多重継承が禁止されている一方で implements を複数指定できる理由は何ですか？
term:
  - '@override'
  - オーバーライド
---

### 単一継承と暗黙的インターフェースの使い分け

* **`extends` (単一継承)**: 親クラスの実装（コード）を引き継ぎます。
* **`implements` (インターフェース実装)**: 親クラスの型シグネチャのみを引き継ぎ、全メソッドを自前で `@override` 再実装します（複数指定可能）。

```dart:extends_implements.dart
class Animal {
  void speak() {
    print('動物が鳴きます');
  }
}

// 1. extends: 実装を引き継ぎオーバーライド
class Dog extends Animal {
  @override
  void speak() {
    print('ワンワン！');
  }
}

// 2. implements: 型のみ流用し全メソッドを自前実装
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
