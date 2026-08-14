---
id: dart-basics-builtin-types
title: 組み込み型と文字列操作
level: 2
question:
  - int型とdouble型の共通の親クラスは何ですか？
  - Dartで文字列補間（String Interpolation）はどう書きますか？
  - 複数行の文字列（ヒアドキュメント）はどう定義しますか？
term:
  - 組み込み型
  - int
  - double
  - num
  - String
  - bool
  - 文字列補間
---

## 組み込み型と文字列操作

[[Dart]]のすべての値はオブジェクトであり、数値や真偽値も含めて `Object` を継承しています。

主要な組み込み型には以下があります。

* **`int`**: 任意精度または64ビット符号付き整数。
* **`double`**: 64ビット倍精度浮動小数点数。
* **`num`**: `int` と `double` の親クラス。整数と小数の両方を許容したい場合に使用。
* **`String`**: UTF-16コードユニットのシーケンス。
* **`bool`**: 真偽値（`true` または `false`）。

### 数値と型変換

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

### 文字列と文字列補間（String Interpolation）

Dartでは、文字列リテラル内に `$変数名` や `${式}` を埋め込むことができます。シングルクォート `'` とダブルクォート `"` のどちらでも記述可能です。

```dart:strings.dart
void main() {
  String language = 'Dart';
  int version = 3;

  // 文字列補間
  String greeting = 'Welcome to $language $version!';
  String calc = '1 + 1 = ${1 + 1}';

  // 複数行文字列（トリプルクォート）
  String multiLine = '''
1行目のテキスト
2行目のテキスト
3行目のテキスト''';

  print(greeting);
  print(calc);
  print(multiLine);
}
```

```dart-exec:strings.dart
Welcome to Dart 3!
1 + 1 = 2
1行目のテキスト
2行目のテキスト
3行目のテキスト
```
