---
id: dart-error-result-pattern
title: Result型（戻り値で成功/失敗を表現するパターン）
level: 2
question:
  - なぜ例外をthrowする代わりにResult型を使うアプローチが好まれるのですか？
  - sealedクラスを使ってResult型（Success / Failure）を定義する方法は？
  - switch式でResult型をハンドリングするメリットは何ですか？
term:
  - Result型
  - Resultパターン
  - Either
  - 成功/失敗
  - 型安全なエラー処理
---

## Result型（戻り値で成功/失敗を表現するパターン）

例外を `throw` するアプローチは、関数の型シグネチャに「どのような例外が発生し得るか」が現れず、呼び出し側がエラー処理を忘れるリスクがあります。

Dart 3の **`sealed` クラス** を使って **[[Result型]]（Result Pattern）** を自作すると、関数の戻り値の型として成功（`Success`）または失敗（`Failure`）を明示できます。

```dart:result_pattern_demo.dart
// 1. sealed クラスで Result 型を定義
sealed class Result<T, E> {
  const Result();
}

final class Success<T, E> extends Result<T, E> {
  final T value;
  const Success(this.value);
}

final class Failure<T, E> extends Result<T, E> {
  final E error;
  const Failure(this.error);
}

// 2. 例外を投げず、Result型を返す安全な除算関数
Result<double, String> safeDivide(double a, double b) {
  if (b == 0) {
    return const Failure('0 で除算することはできません');
  }
  return Success(a / b);
}

void main() {
  final results = [
    safeDivide(10, 2),
    safeDivide(10, 0),
  ];

  for (final res in results) {
    // switch式で網羅的にハンドリング (処理忘れをコンパイル時に防止)
    final output = switch (res) {
      Success(:var value) => '計算結果: $value',
      Failure(:var error) => 'エラー通知: $error',
    };
    print(output);
  }
}
```

```dart-exec:result_pattern_demo.dart
計算結果: 5.0
エラー通知: 0 で除算することはできません
```

> [!TIP]
> Result型を使うことで、呼び出し側は `switch` によるパターンマッチングで結果を取り出すことがコンパイラによって強制され、未処理エラーのバグが根絶されます。
