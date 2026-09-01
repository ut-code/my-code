---
id: dart-class-modifiers-final
title: final 修飾子（外部からの継承・実装を完全に禁止）
level: 3
question:
  - final修飾子をクラスに付けると何が禁止されますか？
  - クラスの動作を完全に不変に保ちたい場合にfinalを使う理由は何ですか？
term:
  - final修飾子
---

### `final` 修飾子（外部からの継承・実装を完全に禁止）

クラスの動作を完全に固定し、外部ライブラリからのサブクラス化（継承 `extends` および実装 `implements` の両方）を一切許さない場合に使用します。

```dart
// 外部ライブラリ側
final class ImmutableConfig {
  final String env;
  const ImmutableConfig(this.env);
}

// 利用側
// class MyConfig extends ImmutableConfig {}   // エラー: extends 不可
// class MyConfig implements ImmutableConfig {} // エラー: implements 不可
```
