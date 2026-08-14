---
id: dart-functions-first-class
title: 第一級オブジェクトとしての関数とアロー構文
level: 2
question:
  - アロー構文（=>）と通常の関数本体（{}）の使い分けは何ですか？
  - Dartで関数の型（Function型）はどのように表現しますか？
  - トップレベル関数とクラスメソッドに関数の扱いの違いはありますか？
term:
  - 第一級オブジェクト
  - アロー関数
  - '=>'
  - 関数型
  - Function
---

## 第一級オブジェクトとしての関数とアロー構文

[[Dart]]の関数は **[[第一級オブジェクト]]** であり、`Function` 型の値として変数に代入したり、高階関数の引数として渡すことができます。

### 1. 関数の基本定義

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

### 2. アロー構文（`=>`）

関数本体が単一の式（Expression）のみで構成される場合、波括弧 `{ return ...; }` の代わりに **`=>`（アロー構文）** を使って簡潔に記述できます。

```dart:arrow_syntax.dart
// 通常の関数定義
int multiplyNormal(int a, int b) {
  return a * b;
}

// アロー構文による定義
int multiplyArrow(int a, int b) => a * b;

void main() {
  print('multiplyNormal: ${multiplyNormal(4, 5)}');
  print('multiplyArrow: ${multiplyArrow(4, 5)}');
}
```

```dart-exec:arrow_syntax.dart
multiplyNormal: 20
multiplyArrow: 20
```

### 3. 関数を変数に代入する

```dart:first_class.dart
void main() {
  // 関数を変数に代入
  int Function(int, int) operation = (a, b) => a + b;
  print('変数から呼び出し: ${operation(10, 20)}');

  operation = (a, b) => a * b;
  print('乗算に変更: ${operation(10, 20)}');
}
```

```dart-exec:first_class.dart
変数から呼び出し: 30
乗算に変更: 200
```
