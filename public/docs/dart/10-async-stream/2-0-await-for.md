---
id: dart-streams-await-for
title: await for によるStreamの購読
level: 2
question:
  - await for 文を使うとどのようなメリットがありますか？
  - await for ループはいつ終了しますか？
term:
  - await for
  - Stream.fromIterable
---

## `await for` によるStreamの購読

`async` 関数内では、**`await for`** ループを使って `Stream` から送られてくるデータを同期ループのように1件ずつ順次処理できます。

ストリームが完了（Done）するまでループが継続します。

```dart:await_for_demo.dart
Stream<int> countStream(int max) async* {
  for (int i = 1; i <= max; i++) {
    yield i;
  }
}

void main() async {
  print('Stream受信開始');

  // await for による順次受信
  await for (final number in countStream(3)) {
    print('受信データ: $number');
  }

  print('Stream完了');
}
```

```dart-exec:await_for_demo.dart
Stream受信開始
受信データ: 1
受信データ: 2
受信データ: 3
Stream完了
```
