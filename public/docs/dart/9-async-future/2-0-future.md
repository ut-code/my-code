---
id: dart-async-future
title: Future の仕組み
level: 2
question:
  - Futureとは具体的に何を表すオブジェクトですか？
  - Futureの状態（Uncompleted, Completed with data, Completed with error）について教えてください。
  - then() と catchError() を使ったコールバック記法はどう書きますか？
term:
  - Future
  - Future.value
  - Future.delayed
  - then
  - コールバック
---

## `Future` の仕組み

**`Future<T>`** は、「将来のある時点で値 `T` またはエラーを返す非同期処理の結果」を表すオブジェクトです（JavaScriptの `Promise` や Rustの `Future` に相当します）。

### Futureの3つの状態

1. **未完了（Uncompleted）**: 非同期処理が実行中で、まだ結果が出ていない状態。
2. **完了（Completed with data）**: 処理が正常に完了し、値が得られた状態。
3. **エラー完了（Completed with error）**: 例外が発生して失敗した状態。

### Futureの生成と `then()` による購読

```dart:future_basics.dart
Future<String> fetchUserGreeting() {
  // 100ミリ秒後に完了する Future を生成
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

`then()` コールバックをチェーンするスタイルも可能ですが、コードがネストしやすいため、通常は次に解説する `async` / `await` を使用します。
