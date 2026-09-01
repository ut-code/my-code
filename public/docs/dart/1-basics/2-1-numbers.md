---
id: dart-basics-numbers
title: 数値と型変換
level: 3
question:
  - 文字列からintやdoubleにパースする方法は？
  - doubleを小数点第1位までに丸めて文字列にする方法は？
term:
  - 型変換
  - int.parse
  - double.parse
---

### 数値と型変換

`int` と `double` は相互に変換でき、文字列との相互変換もメソッドが用意されています。

```dart:numbers.dart
void main() {
  int integer = 42;
  double decimal = 3.14;
  num both = 10;
  both = 2.5; // num型ならdoubleも代入可能

  // 文字列から数値への変換
  int parsedInt = int.parse('100');
  double parsedDouble = double.parse('12.34');

  // 数値から文字列への変換
  String strInt = integer.toString();
  String fixedDec = decimal.toStringAsFixed(1); // "3.1"

  print('parsed: $parsedInt, $parsedDouble');
  print('converted: $strInt, $fixedDec');
}
```

```dart-exec:numbers.dart
parsed: 100, 12.34
converted: 42, 3.1
```
