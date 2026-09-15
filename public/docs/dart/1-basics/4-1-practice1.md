---
id: dart-basics-practice1
title: '練習問題1: 変数と定数の使い分け'
level: 3
question:
  - constとfinalを間違えて宣言した場合、コンパイラはどのようなエラーを出しますか？
  - DateTime.now() の結果をconst変数に代入できない理由を復習したいです。
---

### 練習問題1: 変数と定数の使い分け

以下の仕様を満たすDartプログラムを作成してください。

1. 円周率を保持する定数 `pi` を `const` で定義（値は `3.14159`）。
2. 半径を表す変数 `radius` を `var` で定義し、初期値 `5.0` を代入。
3. 実行時の現在時刻を保持する定数 `createdAt` を `final` で定義（`DateTime.now()` を代入）。
4. 円の面積（$\text{radius} \times \text{radius} \times \pi$）を計算し、`createdAt` と共に文字列補間を使って出力する。

```dart:practice1_1.dart
void main() {
  // ここにコードを書いてください
}
```

```dart-exec:practice1_1.dart
```
