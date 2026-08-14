---
id: dart-async-stream-practice2
title: '練習問題2: StreamControllerを使ったイベント通知'
level: 3
question:
  - ブロードキャストストリームにするための .asBroadcastStream() の使い方を教えてください。
  - 購読リスナーが誰もいない状態でsinkにデータを送るとどうなりますか？
---

### 練習問題2: StreamControllerを使ったイベント通知

メッセージ通知システムを `StreamController` を使って構築してください。

1. `class NotificationHub` を作成する。
   * 内部に `StreamController<String>` を保持する。
   * メソッド `void sendNotification(String message)` でイベントを送信する。
   * ゲッター `Stream<String> get onNotification` でストリームを公開する。
   * メソッド `Future<void> dispose()` でコントローラを閉じる。
2. `main()` でインスタンスを作成し、`onNotification` を `listen` して受信ログを出力する。
3. 2件のメッセージを送信後、`dispose()` を呼ぶ。

```dart:practice10_2.dart
import 'dart:async';

// ここにクラスを定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice10_2.dart
```
