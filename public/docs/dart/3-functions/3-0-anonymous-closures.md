---
id: dart-functions-anonymous-closures
title: 無名関数とクロージャ
level: 2
question:
  - 無名関数（ラムダ式）の書き方はどのようになりますか？
  - クロージャ（変数のキャプチャ）とは何ですか？
  - コレクションのforEachやmapメソッドに渡す無名関数の実例を見たいです。
term:
  - 無名関数
  - 匿名関数
  - ラムダ式
  - クロージャ
  - closure
  - 変数のキャプチャ
---

## 無名関数とクロージャ

### 1. 無名関数（Anonymous Functions / Lambdas）

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

### 2. クロージャ（Closures）

**[[クロージャ]]** とは、関数が定義されたスコープの外側の変数を「キャプチャ（保持）」し、関数が別のスコープで実行されてもその変数にアクセス・変更できる仕組みです。

```dart:closures.dart
// カウンター関数を生成する高階関数
Function makeCounter() {
  int count = 0; // クロージャによってキャプチャされるローカル変数

  return () {
    count++;
    return count;
  };
}

void main() {
  final counter1 = makeCounter();
  final counter2 = makeCounter();

  print('counter1: ${counter1()}'); // 1
  print('counter1: ${counter1()}'); // 2

  print('counter2: ${counter2()}'); // 1 (独立した状態を持つ)
  print('counter1: ${counter1()}'); // 3
}
```

```dart-exec:closures.dart
counter1: 1
counter1: 2
counter2: 1
counter1: 3
```
