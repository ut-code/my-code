---
id: dart-class-extension-practice1
title: '練習問題1: Mixinを用いたロギング機能の追加'
level: 3
question:
  - Mixinの中で自身を特定のクラス型として扱うにはどうしますか？
  - クラス名を取得する runtimeType プロパティの使い方を教えてください。
---

### 練習問題1: Mixinを用いたロギング機能の追加

イベントの発生ログを出力する `PrintableLogger` Mixin を作成し、クラスに適用してください。

1. `mixin PrintableLogger` を定義する。
   * メソッド `void logEvent(String eventName)` を持ち、`'[${runtimeType}] イベント発生: $eventName'` と出力する。
2. `class OrderService with PrintableLogger` を定義し、メソッド `void checkout(String itemId)` 内で `logEvent('注文完了: $itemId')` を呼び出す。
3. `main()` で `OrderService` のインスタンスを作成し、`checkout('item_999')` を実行する。

```dart:practice7_1.dart
// ここにコードを書いてください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice7_1.dart
```
