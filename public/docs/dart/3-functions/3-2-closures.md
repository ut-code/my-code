---
id: dart-functions-closures
title: クロージャと変数のキャプチャ
level: 3
question:
  - クロージャ（変数のキャプチャ）とは何ですか？
  - 複数のクロージャインスタンスがそれぞれ独立した状態を保持する仕組みは？
term:
  - 変数のキャプチャ
  - スコープ
---

### クロージャと変数のキャプチャ

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
