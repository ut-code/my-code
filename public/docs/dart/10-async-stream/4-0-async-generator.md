---
id: dart-streams-async-generator
title: async* と yield（非同期ジェネレータ関数）
level: 2
question:
  - sync* と async* の違いは何ですか？
  - yield* の使いどころを教えてください。
term:
  - async*
  - yield
  - yield*
  - 非同期ジェネレータ
  - sync*
---

## `async*` と `yield`（非同期ジェネレータ関数）

**`async*`（非同期ジェネレータ）** を使うと、関数の内部から時間の経過とともに複数の値を `yield` で順次ストリームへ送り出すことができます。

```dart:async_generator.dart
Stream<String> tickStream(int count) async* {
  for (int i = 1; i <= count; i++) {
    await Future.delayed(const Duration(milliseconds: 50));
    yield 'Tick #$i';
  }
}

void main() async {
  await for (final tick in tickStream(3)) {
    print(tick);
  }
}
```

```dart-exec:async_generator.dart
Tick #1
Tick #2
Tick #3
```

> [!TIP]
> 別のStream全体をそのまま委譲して流したい場合は、**`yield* otherStream;`** を使用します。
