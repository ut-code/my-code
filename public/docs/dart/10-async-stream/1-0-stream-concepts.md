---
id: dart-stream-concepts
title: Stream の概念（Push型のデータフロー）
level: 2
question:
  - 単一購読ストリームとブロードキャストストリームの違いは何ですか？
  - Streamはどのようにデータを送信側に要求する（または受信する）のですか？
  - Streamのリスナー（listen）はどう使いますか？
term:
  - Stream
  - ストリーム
  - 単一購読ストリーム
  - ブロードキャストストリーム
  - listen
---

## `Stream` の概念（Push型のデータフロー）

**`Stream<T>`** は、非同期に連続して流れてくる一連のデータ（データパイプライン）です。

### 1. 単一購読ストリーム（Single-subscription Stream）

* デフォルトのStream。
* ライフサイクルの中で**1つのリスナーだけ**が購読できます（例: ファイル読み込み）。
* 2回以上 `listen()` しようとするとエラーになります。

### 2. ブロードキャストストリーム（Broadcast Stream）

* **複数のリスナー**が同時に購読できます（例: UIのクリックイベント、マウス移動）。
* `stream.asBroadcastStream()` または `StreamController.broadcast()` で作成します。

```dart:stream_listen.dart
void main() {
  // 1から3までのデータを順番に流す Stream
  final stream = Stream.fromIterable([1, 2, 3]);

  // listen でイベントを購読
  final subscription = stream.listen(
    (data) => print('データ受信: $data'),
    onError: (error) => print('エラー: $error'),
    onDone: () => print('ストリーム終了 (Done)'),
  );
}
```

```dart-exec:stream_listen.dart
データ受信: 1
データ受信: 2
データ受信: 3
ストリーム終了 (Done)
```
