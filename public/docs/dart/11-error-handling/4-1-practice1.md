---
id: dart-error-handling-practice1
title: '練習問題1: カスタム例外と適切な例外捕捉'
level: 3
question:
  - 複数の異なるカスタム例外を順番に on 節で捕捉する構文を教えてください。
  - カスタム例外クラスにエラーコードや詳細プロパティを持たせる方法を教えてください。
---

### 練習問題1: カスタム例外と適切な例外捕捉

ユーザーのパスワード設定バリデーション関数と、それをテストするコードを作成してください。

1. `class WeakPasswordException implements Exception` を定義し、`final String reason;` を持たせる。
2. `void validatePassword(String password)` 関数を定義する。
   * パスワードの長さが8文字未満の場合、`WeakPasswordException('8文字以上である必要があります')` をスローする。
   * 数字（`0`〜`9`）を含まない場合、`WeakPasswordException('少なくとも1つの数字を含む必要があります')` をスローする。
3. `main()` でいくつかのテスト用パスワードを渡し、`on WeakPasswordException catch (e)` で捕捉して理由を出力する。

```dart:practice11_1.dart
// ここにコードを書いてください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice11_1.dart
```
