---
id: dart-streams-controller
title: StreamController と StreamSubscription
level: 2
question:
  - 自分で新しいイベントをストリームに流すにはどのクラスを使いますか？
  - StreamController を使い終わった後に close() を呼ぶ必要がある理由は何ですか？
term:
  - StreamController
  - StreamSubscription
  - sink
  - listen
---

## `StreamController` と `StreamSubscription`

プログラム側から能動的にイベントを生成・送信（Push）したい場合は、`dart:async` ライブラリの **`StreamController<T>`** を使用します。
また、購読の開始と停止を制御するために **`StreamSubscription`** を管理します。
