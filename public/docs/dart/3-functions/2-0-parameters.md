---
id: dart-functions-parameters
title: パラメータ（引数）の種類
level: 2
question:
  - 必須の位置パラメータとは何ですか？
  - オプショナルパラメータの種類には何がありますか？
term:
  - 引数
  - パラメータ
  - 位置パラメータ
---

## パラメータ（引数）の種類

[[Dart]]の関数のパラメータには、大きく分けて以下の2つの分類があります。

1. **必須の位置パラメータ（Required Positional Parameters）**:
   通常の引数。渡す順番と型が固定されます。
2. **オプショナルパラメータ（Optional Parameters）**:
   省略可能な引数。**[[名前付き引数]]（`{}`）** と **[[位置指定引数]]（`[]`）** があります。

```dart:parameter_types.dart
// 必須の位置引数
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
