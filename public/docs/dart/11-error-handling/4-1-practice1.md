---
id: dart-error-practice1
title: '練習問題1: カスタム例外と適切な例外捕捉'
level: 3
question:
  - on節とcatch節を組み合わせる書き方を教えてください。
  - rethrowした例外はどこで捕捉されますか？
---

### 練習問題1: カスタム例外と適切な例外捕捉

パスワード強度チェック関数と、その呼び出し側のエラーハンドリングを実装してください。

1. `class WeakPasswordException implements Exception` を定義し、`final String reason` を保持する。
2. `void checkPassword(String password)` 関数を定義する。
   * 文字数が8文字未満の場合、`WeakPasswordException('パスワードは8文字以上必要です')` をスローする。
   * 数字を含まない場合（`!password.contains(RegExp(r'[0-9]'))`）、`WeakPasswordException('数字を1文字以上含める必要があります')` をスローする。
3. `main()` で `'abc'` を渡して `on WeakPasswordException` で捕捉し、理由を出力する。

```dart:practice11_1.dart
// ここにクラスと関数を定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice11_1.dart
```
