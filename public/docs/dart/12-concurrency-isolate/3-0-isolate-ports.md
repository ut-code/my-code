---
id: dart-concurrency-isolate-ports
title: ポート（ReceivePort、SendPort）による双方向メッセージ通信
level: 2
question:
  - 長時間稼働するバックグラウンドワーカーを作るにはどうしますか？
  - ReceivePort と SendPort の役割の違いは何ですか？
  - Isolate.spawn() を使ったワーカーの起動方法は？
term:
  - ReceivePort
  - SendPort
  - メッセージパッシング
  - Isolate.spawn
  - 双方向通信
---

## ポート（`ReceivePort`、`SendPort`）による双方向メッセージ通信

`Isolate.run()` は単発の処理に適していますが、長時間常駐して継続的にメッセージを送受信するバックグラウンドワーカーを作成する場合は、**`ReceivePort`** と **`SendPort`** による **[[メッセージパッシング]]** を使用します。

* **`ReceivePort`**: メッセージの受信口（`Stream` として機能）。
* **`SendPort`**: メッセージの送信先アドレス。

```dart:isolate_ports_demo.dart
import 'dart:isolate';

// ワーカースレッドのエントリーポイント
void worker(SendPort mainSendPort) {
  // ワーカー側の受信ポートを作成
  final workerReceivePort = ReceivePort();

  // ワーカーの送信ポートをメインスレッドに知らせる
  mainSendPort.send(workerReceivePort.sendPort);

  // メインスレッドからの指示を待機
  workerReceivePort.listen((message) {
    if (message is String) {
      // 処理結果をメインスレッドに返信
      mainSendPort.send('処理完了: ${message.toUpperCase()}');
    }
  });
}

void main() async {
  // メイン側の受信ポート
  final mainReceivePort = ReceivePort();

  // ワーカーIsolateを起動
  final isolate = await Isolate.spawn(worker, mainReceivePort.sendPort);

  SendPort? workerSendPort;

  // メイン側でメッセージを受信
  mainReceivePort.listen((message) {
    if (message is SendPort) {
      // ワーカーの送信先を受け取ったら指示を送信
      workerSendPort = message;
      workerSendPort?.send('hello from main');
    } else {
      print('ワーカーからの返信: $message');
      
      // クリーンアップ
      mainReceivePort.close();
      isolate.kill();
      print('通信完了・Isolate破棄');
    }
  });
}
```

```dart-exec:isolate_ports_demo.dart
ワーカーからの返信: 処理完了: HELLO FROM MAIN
通信完了・Isolate破棄
```
