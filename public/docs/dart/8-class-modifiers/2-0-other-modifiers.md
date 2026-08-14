---
id: dart-class-modifiers-base-interface-final
title: base、interface、final 修飾子の使い分け
level: 2
question:
  - クラス修飾子を導入する目的は何ですか？
  - 各修飾子の制約の違いの概要を教えてください。
term:
  - base
  - interface修飾子
  - final修飾子
  - クラス修飾子
---

## `base`、`interface`、`final` 修飾子の使い分け

[[Dart]] 3では、ライブラリ境界外（外部パッケージや別ファイル）からのクラス利用方法を制限するために、各種クラス修飾子が提供されています。

| 修飾子 | 外部でのインスタンス化 | 外部での `extends` (継承) | 外部での `implements` (実装) | 外部での `with` (Mixin) |
| :--- | :---: | :---: | :---: | :---: |
| **`class` (無印)** | ○ | ○ | ○ | × |
| **`base`** | ○ | **○ (`base` 必須)** | × | × |
| **`interface`** | ○ | × | **○** | × |
| **`final`** | ○ | × | × | × |
| **`sealed`** | × (abstract) | × (同ファイル内のみ) | × (同ファイル内のみ) | × |
