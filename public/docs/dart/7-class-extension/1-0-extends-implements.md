---
id: dart-classes-extends-implements
title: extends（継承）と implements（インターフェース実装）の違い
level: 2
question:
  - なぜDartには interface キーワードが別途不要だったのですか？
  - 暗黙的インターフェースとは何ですか？
term:
  - extends
  - 継承
  - implements
  - 暗黙的インターフェース
  - インターフェース
---

## `extends`（継承）と `implements`（インターフェース実装）の違い

[[Dart]]では、すべてのクラスが自動的に **[[暗黙的インターフェース]]（Implicit Interface）** を定義しています。これにより、任意のクラスを `implements` の対象として利用できます。
