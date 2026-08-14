---
id: dart-async-future-details
title: Futureの3つの状態と then() による購読
level: 3
question:
  - Futureの3つの状態（Uncompleted, Completed with data, Completed with error）とは？
  - then() と catchError() を使ったコールバック記法はどう書きますか？
term:
  - then
  - catchError
  - コールバック
---

### Futureの3つの状態と `then()` による購読

Futureには以下の3つの状態があります。

1. **未完了（Uncompleted）**: 非同期処理が実行中で、まだ結果が出ていない状態。
2. **値完了（Completed with data）**: 処理が正常に完了し、値が得られた状態。
3. **エラー完了（Completed with error）**: 例外が発生して失敗した状態。

```dart:future_basics.dart
Future<String> fetchUserGreeting() {
  return Future.delayed(
    const Duration(milliseconds: 100),
    () => 'こんにちは、ユーザーさん！',
  );
}

void main() {
  print('1. 処理開始');

  fetchUserGreeting().then((greeting) {
    print('3. データ受信: $greeting');
  }).catchError((error) {
    print('エラー: $error');
  });

  print('2. メイン関数の同期処理完了');
}
```

```dart-exec:future_basics.dart
1. 処理開始
2. メイン関数の同期処理完了
3. データ受信: こんにちは、ユーザーさん！
```
