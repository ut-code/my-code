---
id: dart-streams-subscription
title: StreamController によるイベント送信と購読制御
level: 3
question:
  - StreamControllerのsinkプロパティの役割は何ですか？
  - StreamSubscriptionをcancel()しないと何が発生しますか（メモリリーク）？
term:
  - メモリリーク
  - キャンセル
  - cancel
---

### StreamController によるイベント送信と購読制御

`controller.sink.add(value)` でデータを送信し、購読は `stream.listen(...)` で行います。

```dart:stream_controller_demo.dart
import 'dart:async';

void main() async {
  // StreamController の作成
  final controller = StreamController<String>();

  // 購読を開始 (StreamSubscription を保持)
  final subscription = controller.stream.listen(
    (message) => print('受信: $message'),
    onError: (error) => print('エラー受信: $error'),
    onDone: () => print('ストリーム終了 (Done)'),
  );

  // イベントの発行 (sink経由)
  controller.sink.add('第1通知: ユーザーログイン');
  controller.sink.add('第2通知: メッセージ受信');
  controller.sink.addError('第3通知: 接続不安定警告');

  // ストリームを閉じる
  await controller.close();

  // 不要になったら購読を破棄（メモリリーク防止）
  await subscription.cancel();
}
```

```dart-exec:stream_controller_demo.dart
受信: 第1通知: ユーザーログイン
受信: 第2通知: メッセージ受信
エラー受信: 第3通知: 接続不安定警告
ストリーム終了 (Done)
```

> [!WARNING]
> 不要になった `StreamSubscription` は必ず `cancel()` し、`StreamController` は `close()` してメモリリークを防ぎましょう。
