---
id: dart-functions-first-class
title: 第一級オブジェクトとしての関数
level: 2
question:
  - 関数の基本的な定義構文はどう書きますか？
  - Dartで関数の型（Function型）はどのように表現しますか？
term:
  - 第一級オブジェクト
  - 関数型
  - Function
---

## 第一級オブジェクトとしての関数

[[Dart]]の関数は **[[第一級オブジェクト]]** であり、`Function` 型の値として変数に代入したり、高階関数の引数として渡すことができます。

まずは標準的な関数定義を見てみましょう。

```dart:function_basics.dart
int add(int a, int b) {
  return a + b;
}

void main() {
  int result = add(3, 5);
  print('3 + 5 = $result');
}
```

```dart-exec:function_basics.dart
3 + 5 = 8
```
