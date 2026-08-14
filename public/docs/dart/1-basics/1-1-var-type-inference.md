---
id: dart-basics-type-inference
title: var による型推論と型明示
level: 3
question:
  - varで宣言した変数に異なる型の値を再代入できますか？
  - 型を明示するべき場面はどのようなときですか？
term:
  - var
  - 静的型付け
---

### `var` による型推論と型明示

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

一度型が推論された変数に異なる型の値を代入しようとすると、コンパイルエラーになります。

型を明示的に記述することも可能です。

```dart:type_explicit.dart
void main() {
  String message = 'Hello';
  int count = 10;
  print('$message: $count 件');
}
```

```dart-exec:type_explicit.dart
Hello: 10 件
```
