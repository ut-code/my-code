---
id: dart-concurrency-isolate-practice2
title: '練習問題2: ポートを使った双方向ワーカーの作成'
level: 3
question:
  - Isolateでエラーが発生したときにメインスレッドに通知する onError ポートの設定方法は？
  - 複数のワーカーをプールして管理する設計のポイントは何ですか？
---

### 練習問題2: ポートを使った双方向ワーカーの作成

メインスレッドから渡された文字列を逆順にして返信するワーカーIsolateを作成してください。

1. `void echoWorker(SendPort mainSendPort)` を作成する。
   * 自身の `ReceivePort` を作成し、その `sendPort` を `mainSendPort` に送信する。
   * 受信したメッセージが `String` であれば、文字列を逆順（`message.split('').reversed.join()`）にして `mainSendPort` に返信する。
2. `main()` で `Isolate.spawn(echoWorker, mainReceivePort.sendPort)` を起動し、`'Flutter & Dart'` という文字列を送信して逆順になった文字列を受信・出力する。

```dart:practice12_2.dart
import 'dart:isolate';

// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice12_2.dart
```
