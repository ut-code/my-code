---
id: dart-functions-anonymous
title: 無名関数（ラムダ式）
level: 3
question:
  - コレクションのforEachメソッドに無名関数を渡す書き方を教えてください。
  - 無名関数でアロー構文を使うことはできますか？
term:
  - ラムダ式
  - コールバック関数
---

### 無名関数（ラムダ式）

関数名を付けずに定義する関数を **[[無名関数]]** と呼びます。イベントハンドラやコレクションの操作（[[./4]]参照）に頻繁に利用されます。

```dart:anonymous_functions.dart
void main() {
  final fruits = ['apple', 'banana', 'orange'];

  // (item) { ... } という無名関数を forEach に渡す
  fruits.forEach((fruit) {
    print('フルーツ: $fruit');
  });

  // アロー構文を用いた無名関数
  fruits.forEach((fruit) => print('UPPER: ${fruit.toUpperCase()}'));
}
```

```dart-exec:anonymous_functions.dart
フルーツ: apple
フルーツ: banana
フルーツ: orange
UPPER: APPLE
UPPER: BANANA
UPPER: ORANGE
```
