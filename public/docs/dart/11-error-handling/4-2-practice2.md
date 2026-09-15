---
id: dart-error-practice2
title: '練習問題2: sealedクラスによるResult型の実装'
level: 3
question:
  - Result型に map や flatMap などのヘルパーメソッドを生やすことはできますか？
  - 実務でResult型を採用するメリットを教えてください。
---

### 練習問題2: sealedクラスによるResult型の実装

`sealed` クラスを用いた `Result` パターンを使い、安全なJSONパース関数を実装してください。

1. `sealed class ParseResult<T>` を定義し、`ParseSuccess<T>` と `ParseFailure<T>` を作成する。
2. `ParseResult<int> parsePositiveInt(String input)` 関数を定義する。
   * `int.tryParse(input)` でパースを試み、失敗した場合は `ParseFailure('数値を入力してください')` を返す。
   * パースできた値が 0 以下の場合は `ParseFailure('正の整数を入力してください')` を返す。
   * 正常な正の整数の場合は `ParseSuccess(value)` を返す。
3. `main()` で `'42'`, `'-5'`, `'abc'` を渡してテストし、`switch` 式で結果を出力する。

```dart:practice11_2.dart
// ここにクラスと関数を定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice11_2.dart
```
