---
id: dart-error-handling-practice2
title: '練習問題2: sealedクラスによるResult型の実装'
level: 3
question:
  - Result型に map や flatMap のような便利メソッドを生やすことはできますか？
  - 非同期処理 Future<Result<T, E>> と組み合わせるパターンの使いどころを教えてください。
---

### 練習問題2: sealedクラスによるResult型の実装

文字列から整数への変換を安全に行う関数 `safeParseInt` を作成してください。

1. 本章で学習した `sealed class Result<T, E>`（`Success<T, E>` と `Failure<T, E>`）を定義する。
2. `Result<int, String> safeParseInt(String input)` を作成する。
   * `int.tryParse(input)` を使い、変換成功時は `Success(value)` を返す。
   * 失敗時は `Failure('"$input" は有効な整数ではありません')` を返す。
3. `main()` で `'123'` と `'abc'` を変換し、`switch` 式を使って結果を出力する。

```dart:practice11_2.dart
// ここにコードを書いてください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice11_2.dart
```
