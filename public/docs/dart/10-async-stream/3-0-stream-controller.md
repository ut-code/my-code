---
id: dart-stream-controller
title: StreamController と StreamSubscription
level: 2
question:
  - StreamControllerの sink と stream の役割の違いは何ですか？
  - StreamSubscription を使って購読を一時停止・再開・解除する方法は？
  - StreamController を使い終わった後に close() を呼ぶべき理由は何ですか？
term:
  - StreamController
  - StreamSubscription
  - sink
  - close
  - cancel
---

## `StreamController` と `StreamSubscription`

### 1. `StreamController`: イベントの送信と管理

プログラムの任意の場所からデータを流し込みたい場合、**`StreamController<T>`** を使用します。

* `controller.sink.add(value)`: データをストリームへ送信。
* `controller.sink.addError(error)`: エラーイベントを送信。
* `controller.close()`: ストリームの終了（完了）を通知（メモリリーク防止のため必須）。
* `controller.stream`: 購読用の `Stream` オブジェクト。

```dart:stream_controller_demo.dart
import 'dart:async';

void main() async {
  final controller = StreamController<String>();

  // 購読側の設定
  controller.stream.listen(
    (message) => print('通知: $message'),
    onDone: () => print('コントローラ停止'),
  );

  // イベントの発行
  controller.sink.add('第1報: サーバー起動');
  controller.sink.add('第2報: クライアント接続');
  
  await controller.close(); // ストリームをクローズ
}
```

```dart-exec:stream_controller_demo.dart
通知: 第1報: サーバー起動
通知: 第2報: クライアント接続
コントローラ停止
```

### 2. `StreamSubscription`: 購読の制御

`stream.listen()` の戻り値である `StreamSubscription` オブジェクトを使って、購読の中断・再開や、途中で購読を破棄（`subscription.cancel()`）できます。
