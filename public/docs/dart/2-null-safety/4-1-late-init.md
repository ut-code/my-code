---
id: dart-null-safety-late-init
title: late による初期化の遅延とLazy評価
level: 3
question:
  - late変数に初期化式を書いた場合、いつ実行されますか？
  - LateInitializationError を防ぐための注意点は何ですか？
term:
  - 遅延初期化
  - Lazy評価
  - LateInitializationError
---

### `late` による初期化の遅延とLazy評価

`late` 変数に初期化式を記述すると、その変数に**初めてアクセスされた瞬間**にのみ計算が行われます（Lazy評価）。

```dart:late_lazy.dart
String heavyComputation() {
  print('-> 重い計算を実行中...');
  return '計算結果: 42';
}

void main() {
  print('プログラム開始');
  late String lazyData = heavyComputation(); // この時点ではまだ実行されない

  print('データが必要になりました:');
  print(lazyData); // ここで初めて heavyComputation が呼ばれる
  print('二度目の参照: $lazyData'); // 既に計算済みなので再実行はされない
}
```

```dart-exec:late_lazy.dart
プログラム開始
データが必要になりました:
-> 重い計算を実行中...
計算結果: 42
二度目の参照: 計算結果: 42
```

> [!WARNING]
> 初期化式のない `late` 変数を値代入前に参照すると、`LateInitializationError` が発生します。
