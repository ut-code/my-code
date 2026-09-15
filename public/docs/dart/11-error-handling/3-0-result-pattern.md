---
id: dart-error-result-pattern
title: Result型（戻り値で成功/失敗を表現するパターン）
level: 2
question:
  - なぜ例外を投げる代わりにResult型を使うアプローチが好まれるのですか？
  - sealedクラスとswitch式を使ったResult型の実装方法は？
term:
  - Result型
  - 成功/失敗パターン
---

## Result型（戻り値で成功/失敗を表現するパターン）

例外を `throw` するアプローチは、関数の呼び出し側がエラー処理を忘れてしまうリスクがあります。

Dart 3の `sealed` クラス（[[./8]]参照）を活用すると、RustやSwiftのような **[[Result型]]** を型安全に自作でき、エラーハンドリングをコンパイル時に強制できます。

```dart:result_pattern_demo.dart
// 1. sealed クラスで Result 型を定義
sealed class Result<T, E> {
  const Result();
}

class Success<T, E> extends Result<T, E> {
  final T value;
  const Success(this.value);
}

class Failure<T, E> extends Result<T, E> {
  final E error;
  const Failure(this.error);
}

// 2. 例外をスローせず Result 型を返す関数
Result<int, String> divide(int a, int b) {
  if (b == 0) {
    return const Failure('0 で割ることはできません');
  }
  return Success(a ~/ b);
}

void main() {
  final res1 = divide(10, 2);
  final res2 = divide(10, 0);

  for (final res in [res1, res2]) {
    // switch式で Success と Failure を完全網羅
    final msg = switch (res) {
      Success(:var value) => '計算結果: $value',
      Failure(:var error) => 'エラー: $error',
    };
    print(msg);
  }
}
```

```dart-exec:result_pattern_demo.dart
計算結果: 5
エラー: 0 で割ることはできません
```
