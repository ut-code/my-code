---
id: dart-streams-operators
title: Streamの変換オペレータ（where, map）
level: 3
question:
  - Streamに対してもwhereやmapなどのオペレータを適用できますか？
  - Streamを変換した結果の型はどうなりますか？
term:
  - Stream変換
  - リアクティブプログラミング
---

### Streamの変換オペレータ（where, map）

`Iterable` と同様に、`Stream` に対しても `where`（フィルタリング）、`map`（変換）、`take`（指定件数取得）などのパイプライン処理をメソッドチェーンで適用できます。

```dart:stream_operators.dart
void main() async {
  final numbersStream = Stream.fromIterable([1, 2, 3, 4, 5, 6]);

  // 偶数だけを抽出し、10倍に変換して最初の2件を取得
  final transformedStream = numbersStream
      .where((n) => n.isEven)
      .map((n) => n * 10)
      .take(2);

  await for (final val in transformedStream) {
    print('変換後データ: $val');
  }
}
```

```dart-exec:stream_operators.dart
変換後データ: 20
変換後データ: 40
```
