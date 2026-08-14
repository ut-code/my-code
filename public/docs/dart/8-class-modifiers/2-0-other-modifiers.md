---
id: dart-class-modifiers-base-interface-final
title: base、interface、final 修飾子の使い分け
level: 2
question:
  - base修飾子を付けると外部パッケージでどのような制約が課されますか？
  - interface修飾子と通常のclassの違いは何ですか？
  - final修飾子をクラスに付けた場合、継承や実装はどう制限されますか？
term:
  - base
  - interface修飾子
  - final修飾子
  - クラス修飾子
  - abstract
---

## `base`、`interface`、`final` 修飾子の使い分け

[[Dart]] 3では、ライブラリ境界外（外部パッケージや別ファイル）からのクラス利用方法を制限するために、以下のクラス修飾子が提供されています。

| 修飾子 | 外部でのインスタンス化 | 外部での `extends` (継承) | 外部での `implements` (実装) | 外部での `with` (Mixin) |
| :--- | :---: | :---: | :---: | :---: |
| **`class` (無印)** | ○ | ○ | ○ | × |
| **`base`** | ○ | **○ (`base` 必須)** | × | × |
| **`interface`** | ○ | × | **○** | × |
| **`final`** | ○ | × | × | × |
| **`sealed`** | × (abstract) | × (同ファイル内のみ) | × (同ファイル内のみ) | × |

### 1. `base`: 継承のみを許可し、暗黙的インターフェースのimplementsを禁止

クラスに新しいメソッドを追加しても、外部のサブクラスが壊れないように設計したい場合に利用します。

```dart
// 外部ライブラリ側
base class Vehicle {
  void move() => print('移動中');
}

// 利用側
// class Car implements Vehicle {} // コンパイルエラー: implements 不可
base class Car extends Vehicle {}   // OK (子クラスも base/final/sealed が必要)
```

### 2. `interface`: 実装（implements）のみを許可し、継承を禁止

APIの型シグネチャのみを提供し、内部実装の継承による依存を防ぎたい場合に利用します。

```dart
interface class StorageService {
  void save(String key, String value) {}
}
// class LocalStorage extends StorageService {} // エラー: 外部から extends 不可
class LocalStorage implements StorageService {   // OK: implements のみ許可
  @override
  void save(String key, String value) => print('Saved $key');
}
```

### 3. `final`: 外部からの継承・実装を完全に禁止

クラスの動作を完全に固定し、サブクラス化を一切許さない場合に使用します。
