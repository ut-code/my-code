---
id: dart-isolate-practice2
title: '練習問題2: ポートを使った双方向ワーカーの作成'
level: 3
question:
  - Isolate間のメッセージパッシングで送信できるオブジェクトの制限は何ですか？
  - バックグラウンドIsolateで例外が発生した場合のハンドリング方法は？
---

### 練習問題2: ポートを使った双方向ワーカーの作成

文字列を反転して大文字にするワーカースレッドを作成し、メッセージを送受信してください。

1. `void textProcessor(SendPort mainSendPort)` を定義する。
   * 自身の `ReceivePort` を作成し、その `sendPort` を `mainSendPort` に送る。
   * 送られてきた文字列を逆順（`split('').reversed.join()`）かつ大文字（`toUpperCase()`）にして送り返す。
2. `main()` で `Isolate.spawn(textProcessor, receivePort.sendPort)` を起動する。
3. `'hello dart'` を送信し、ワーカーから `'TRAD OLLEH'` が返ってくることを確認してポートを閉じる。

```dart:practice12_2.dart
import 'dart:isolate';

// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice12_2.dart
```
