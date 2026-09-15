---
id: dart-class-modifiers-base
title: base 修飾子（継承のみを許可し implements を禁止）
level: 3
question:
  - base修飾子を付けると外部パッケージでどのような制約が課されますか？
  - baseクラスを継承するサブクラスにもbaseやfinalの指定が必要ですか？
term:
  - base
---

### `base` 修飾子（継承のみを許可し implements を禁止）

クラスに新しいメソッドを追加しても外部のサブクラスが壊れないように設計したい場合に利用します。外部ライブラリからの暗黙的インターフェース実装（`implements`）を禁止します。

```dart
// 外部ライブラリ側
base class Vehicle {
  void move() => print('移動中');
}

// 利用側
// class Car implements Vehicle {} // エラー: implements 不可
base class Car extends Vehicle {}   // OK: extends のみ許可
```
