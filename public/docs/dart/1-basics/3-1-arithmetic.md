---
id: dart-basics-arithmetic
title: 算術演算子と整数除算（~/）
level: 3
question:
  - 通常の除算 / と整数除算 ~/ の違いは何ですか？
  - 剰余演算子 % の使い方は？
term:
  - 整数除算
  - '~/'
  - 剰余
---

### 算術演算子と整数除算（`~/`）

通常の除算 `/` は常に `double` を返します。商の整数部分のみを取得したい場合は **`~/`**（整数除算演算子）を使います。

```dart:operators_arithmetic.dart
void main() {
  int a = 10;
  int b = 3;

  print('加算 (+): ${a + b}');
  print('通常除算 (/): ${a / b}');   // double (3.3333333333333335)
  print('整数除算 (~/): ${a ~/ b}'); // int (3)
  print('剰余 (%): ${a % b}');       // int (1)
}
```

```dart-exec:operators_arithmetic.dart
加算 (+): 13
通常除算 (/): 3.3333333333333335
整数除算 (~/): 3
剰余 (%): 1
```
