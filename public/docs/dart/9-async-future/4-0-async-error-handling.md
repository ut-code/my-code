---
id: dart-async-error-handling
title: 非同期処理のエラーハンドリング（try-catch-finally）
level: 2
question:
  - async/await でのエラーハンドリングは通常の try-catch と同じですか？
  - 非同期例外を確実に捕捉するための注意点は何ですか？
term:
  - 非同期エラーハンドリング
  - try-catch-finally
  - try
  - catch
  - finally
---

## 非同期処理のエラーハンドリング（`try-catch-finally`）

`async` / `await` を使った非同期処理では、同期コードと全く同じ **`try-catch-finally`** 構文で例外を捕捉できます。

```dart:async_try_catch.dart
Future<String> loadDataFromServer({required bool shouldFail}) async {
  await Future.delayed(const Duration(milliseconds: 50));
  if (shouldFail) {
    throw Exception('ネットワーク接続が切断されました');
  }
  return '正常データレスポンス';
}

Future<void> handleRequest(bool shouldFail) async {
  try {
    print('リクエスト送信...');
    final data = await loadDataFromServer(shouldFail: shouldFail);
    print('成功: $data');
  } catch (e) {
    print('例外をキャッチ: $e');
  } finally {
    print('リソースクリーンアップ完了\n');
  }
}

void main() async {
  await handleRequest(false);
  await handleRequest(true);
}
```

```dart-exec:async_try_catch.dart
リクエスト送信...
成功: 正常データレスポンス
リソースクリーンアップ完了

リクエスト送信...
例外をキャッチ: Exception: ネットワーク接続が切断されました
リソースクリーンアップ完了
```

> [!TIP]
> `await` を付け忘れた `Future` で例外が発生すると、`try-catch` ブロックをすり抜けて未処理の非同期例外となるため注意してください。
