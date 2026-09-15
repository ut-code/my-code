---
id: dart-isolate-ports
title: ポート（ReceivePort、SendPort）による双方向メッセージ通信
level: 2
question:
  - ReceivePort と SendPort の役割の違いは何ですか？
  - バックグラウンドワーカーIsolateとメインIsolateで双方向通信を行う手順は？
term:
  - ReceivePort
  - SendPort
  - メッセージパッシング
  - ポート通信
---

## ポート（ReceivePort、SendPort）による双方向メッセージ通信

長時間常駐するバックグラウンドワーカーを作成し、メインIsolateとの間で継続的な双方向通信を行うには、**`ReceivePort`** と **`SendPort`** によるメッセージパッシングを使用します。

```dart:isolate_ports_demo.dart
import 'dart:isolate';

// ワーカーIsolateのエントリーポイント
void worker(SendPort mainSendPort) {
  final workerReceivePort = ReceivePort();
  // 自身のSendPortをメインIsolateに送り返す
  mainSendPort.send(workerReceivePort.sendPort);

  // メインからのメッセージを待ち受ける
  workerReceivePort.listen((message) {
    if (message is int) {
      final squared = message * message;
      mainSendPort.send('計算結果: $squared');
    }
  });
}

void main() async {
  final mainReceivePort = ReceivePort();

  // ワーカーIsolateを起動
  await Isolate.spawn(worker, mainReceivePort.sendPort);

  // 最初に応答として送られてくるワーカーのSendPortを取得
  final workerSendPort = await mainReceivePort.first as SendPort;

  // 新たな受信ポートを作成して結果を待機
  final responsePort = ReceivePort();
  workerSendPort.send(7);

  mainReceivePort.close();
}
```

> [!NOTE]
> メッセージとして送信できるデータは、プリミティブ型、コレクション、一部のシステムオブジェクトなどに限られ、Isolateを跨ぐ際にディープコピー（または転送）されます。
