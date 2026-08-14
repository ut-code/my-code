---
id: dart-stream-await-for
title: await for によるStreamの購読
level: 2
question:
  - await for ループはいつ終了しますか？
  - await for の中で break や return を使うとストリームはどうなりますか？
  - Streamの高階メソッド（map, where, take）と組み合わせる方法は？
term:
  - await for
  - Stream購読
  - take
---

## `await for` によるStreamの購読

`async` 関数内では、**`await for` ループ** を使うことで、ストリームからデータが流れてくるたびに同期的な `for-in` ループのように直感的に処理できます。

ストリームが `onDone`（完了）を発行するまでループが継続します。

```dart:await_for_demo.dart
Future<void> processStream(Stream<int> stream) async {
  print('--- 処理開始 ---');
  await for (final value in stream) {
    print('受信値: $value (2倍: ${value * 2})');
  }
  print('--- 全データ受信完了 ---');
}

void main() async {
  // 10, 20, 30 を流すストリーム
  final dataStream = Stream.fromIterable([10, 20, 30]);
  await processStream(dataStream);
}
```

```dart-exec:await_for_demo.dart
--- 処理開始 ---
受信値: 10 (2倍: 20)
受信値: 20 (2倍: 40)
受信値: 30 (2倍: 60)
--- 全データ受信完了 ---
```

### Streamの変換オペレータ

Streamも `List` と同様に `map` や `where`、`take` などのオペレータでパイプライン処理が可能です。

```dart:stream_operators.dart
void main() async {
  final stream = Stream.fromIterable([1, 2, 3, 4, 5, 6]);

  final filtered = stream
      .where((n) => n.isEven)
      .map((n) => '偶数: $n');

  await for (final item in filtered) {
    print(item);
  }
}
```

```dart-exec:stream_operators.dart
偶数: 2
偶数: 4
偶数: 6
```
