---
id: dart-streams-types
title: 単一購読ストリームとブロードキャストストリーム
level: 3
question:
  - 単一購読ストリーム（Single-subscription）とブロードキャストストリーム（Broadcast）の違いは何ですか？
  - 単一購読ストリームを複数回listenするとどうなりますか？
term:
  - 単一購読ストリーム
  - ブロードキャストストリーム
  - asBroadcastStream
---

### 単一購読ストリームとブロードキャストストリーム

DartのStreamには2つのモードが存在します。

* **単一購読ストリーム（Single-subscription Stream）**:
  デフォルトのStream。最初から最後までのイベント順序が保証され、**同時に1つのリスナーのみ** が購読（`listen`）できます。ファイルの読み込みやHTTPレスポンスなどに適しています。
* **ブロードキャストストリーム（Broadcast Stream）**:
  **複数のリスナーが同時に購読可能** なStream。リスナーが購読を開始した瞬間以降のイベントのみを受信します。UIのクリックイベントや通知システムに適しています。`stream.asBroadcastStream()` で変換できます。
