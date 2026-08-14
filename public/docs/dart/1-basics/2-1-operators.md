---
id: dart-basics-operators
title: 基本的な演算子
level: 2
question:
  - 整数除算を行う演算子は何ですか？
  - is や is! 演算子は何のために使われますか？
  - 三項演算子やカスケード記法はどのように使いますか？
term:
  - 演算子
  - 算術演算子
  - 比較演算子
  - 論理演算子
  - 型テスト演算子
  - 整数除算
---

## 基本的な演算子

Dartには一般的な言語と同様の算術・比較・論理演算子に加えて、Dart特有の便利な演算子があります。

### 1. 算術演算子と整数除算 (`~/`)

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

### 2. 型テスト演算子 (`is`, `is!`, `as`)

オブジェクトが特定の型であるかを判定します。

* `is`: 指定した型であれば `true`
* `is!`: 指定した型でなければ `true`
* `as`: 型キャスト（型が合わない場合は実行時エラー）

```dart:type_test.dart
void main() {
  Object value = 'Dart Programming';

  if (value is String) {
    // ifスコープ内では value が String にスマートキャストされる
    print('文字列の長さ: ${value.length}');
  }

  if (value is! int) {
    print('value は int ではありません');
  }
}
```

```dart-exec:type_test.dart
文字列の長さ: 16
value は int ではありません
```

### 3. 三項条件演算子 (`condition ? expr1 : expr2`)

```dart:ternary.dart
void main() {
  int score = 85;
  String result = score >= 60 ? '合格' : '不合格';
  print('結果: $result');
}
```

```dart-exec:ternary.dart
結果: 合格
```
