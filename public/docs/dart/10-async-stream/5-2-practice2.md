---
id: dart-async-stream-practice2
title: '練習問題2: StreamControllerを使ったイベント通知'
level: 3
question:
  - StreamControllerでエラーを流す sink.addError の使い方を教えてください。
  - listen の onError コールバックでエラーを処理する方法を復習したいです。
---

### 練習問題2: StreamControllerを使ったイベント通知

タスクの進行状況（進捗率: 0〜100%）を通知する進捗トラッカーを実装してください。

1. `StreamController<int>` を作成する。
2. コントローラのストリームを `listen` し、`'進捗: $percent%'` と出力するリスナーを登録する。
3. `sink.add` を使って、`25`, `50`, `75`, `100` を順番に送信する。
4. 送信完了後に `await controller.close()` を呼び出し、ストリームを終了する。

```dart:practice10_2.dart
import 'dart:async';

void main() async {
  // ここにコードを書いてください
}
```

```dart-exec:practice10_2.dart
```
