---
id: dart-functions-parameters
title: パラメータ（引数）の種類
level: 2
question:
  - 位置パラメータと名前付きパラメータの混在は可能ですか？
  - 引数のデフォルト値はどのように指定しますか？
  - Dartのパラメータ設計のベストプラクティスは何ですか？
term:
  - 引数
  - パラメータ
  - 位置パラメータ
  - デフォルト引数
---

## パラメータ（引数）の種類

[[Dart]]の関数のパラメータには、大きく分けて以下の2つの分類があります。

1. **必須の位置パラメータ（Required Positional Parameters）**:
   通常の引数。渡す順番と型が固定されます。
2. **オプショナルパラメータ（Optional Parameters）**:
   省略可能な引数。さらに以下の2種類に分かれます。
   * **[[名前付き引数]]（Named Parameters）**: `{}` で囲む。呼び出し時に `name: value` で指定。
   * **[[位置指定引数]]（Optional Positional Parameters）**: `[]` で囲む。順番通りに省略可能。

```dart:parameter_types.dart
// 1. 必須の位置引数
void greet(String name, String message) {
  print('$nameさん、$message');
}

void main() {
  greet('Alice', 'こんにちは');
}
```

```dart-exec:parameter_types.dart
Aliceさん、こんにちは
```
