---
id: dart-async-future-wait
title: Future.wait による複数の非同期処理の並行実行
level: 3
question:
  - Future.waitを使って複数の非同期タスクを並行実行する方法を教えてください。
  - 並行実行と直列実行で所要時間はどう変化しますか？
term:
  - Future.wait
  - 並行実行
---

### `Future.wait` による複数の非同期処理の並行実行

互いに依存しない複数の非同期処理を同時に実行したい場合は、`Future.wait` を使います。

```dart:future_wait.dart
Future<String> fetchPostTitle() async => 'Dart 3の紹介';
Future<int> fetchLikeCount() async => 128;

void main() async {
  // 並行して実行し、両方の完了を待つ
  final results = await Future.wait([
    fetchPostTitle(),
    fetchLikeCount(),
  ]);

  print('タイトル: ${results[0]}');
  print('いいね数: ${results[1]}');
}
```

```dart-exec:future_wait.dart
タイトル: Dart 3の紹介
いいね数: 128
```
