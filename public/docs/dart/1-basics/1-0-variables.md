---
id: dart-basics-variables
title: 変数宣言と型推論
level: 2
question:
  - 型を明示する場合とvarを使う場合の使い分けの目安はありますか？
  - 初期化せずに変数宣言したときの初期値は何ですか？
  - Dartで変数名に使える命名規則はどうなっていますか？
term:
  - 変数
  - 変数宣言
  - 型推論
---

## 変数宣言と型推論

[[Dart]]は静的型付け言語ですが、初期値から型を自動で推論する **[[型推論]]** を強力にサポートしています。

変数を宣言する方法は、主に以下の2通りがあります。

### 1. `var` による型推論

初期値が存在する場合、`var` キーワードを使うとコンパイラが自動的に型を決定します。

```dart:variables_intro.dart
void main() {
  var name = 'Dart'; // String 型と推論される
  var version = 3;     // int 型と推論される
  
  print('$name のバージョン: $version');
}
```

```dart-exec:variables_intro.dart
Dart のバージョン: 3
```

一度型が推論された変数に、異なる型の値を代入しようとするとコンパイルエラーになります。

```dart
var score = 100;
// score = '満点'; // コンパイルエラー: A value of type 'String' can't be assigned to a variable of type 'int'.
```

### 2. 型を明示する宣言

型を明示的に記述することも可能です。変数の意図をコード上で強調したい場合や、初期値を後から代入する場合に使われます。

```dart:type_explicit.dart
void main() {
  String message = 'Hello';
  int count = 10;
  double price = 99.9;
  bool isActive = true;

  print('$message: $count 件, 価格: $price 円, 有効: $isActive');
}
```

```dart-exec:type_explicit.dart
Hello: 10 件, 価格: 99.9 円, 有効: true
```
