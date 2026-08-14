---
id: dart-error-try-catch
title: 'try、catch、on、finally とカスタム例外'
level: 2
question:
  - catch 節の第2引数（StackTrace）の使い方は？
  - rethrow キーワードはどのような場面で使用しますか？
term:
  - 例外処理
  - 'on'
  - rethrow
  - Exception
  - Error
  - StackTrace
---

## `try`、`catch`、`on`、`finally` とカスタム例外

[[Dart]]では、任意のオブジェクトを例外として `throw` できますが、通常は `Exception` または `Error` を実装したクラスをスローします。

* **`on ExceptionType`**: 特定の例外型だけを指定してキャッチします。
* **`catch (e, stackTrace)`**: 例外オブジェクトとスタックトレースを取得します。
* **`rethrow`**: キャッチした例外を処理した後、再度上位の呼び出し元へ再スローします。
* **`finally`**: 例外の有無にかかわらず、最後に必ず実行されるクリーンアップブロックです。

```dart:custom_exception_demo.dart
class ValidationException implements Exception {
  final String message;
  ValidationException(this.message);

  @override
  String toString() => 'ValidationException: $message';
}

void validateAge(int age) {
  if (age < 0) {
    throw ValidationException('年齢は0以上である必要があります');
  }
}

void main() {
  try {
    print('年齢チェック開始');
    validateAge(-5);
  } on ValidationException catch (e) {
    print('検証エラーをキャッチ: $e');
  } catch (e, stack) {
    print('予期せぬエラー: $e\n$stack');
  } finally {
    print('検証処理終了（finallyブロック実行）');
  }
}
```

```dart-exec:custom_exception_demo.dart
年齢チェック開始
検証エラーをキャッチ: ValidationException: 年齢は0以上である必要があります
検証処理終了（finallyブロック実行）
```
