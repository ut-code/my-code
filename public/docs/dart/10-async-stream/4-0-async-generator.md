---
id: dart-stream-generator
title: async* と yield（非同期ジェネレータ関数）
level: 2
question:
  - async* 関数と通常の async 関数の違いは何ですか？
  - yield と yield* の使い分けはどうなりますか？
  - 定期的に値を送信するストリームを async* で書く方法は？
term:
  - 'async*'
  - yield
  - yield*
  - 非同期ジェネレータ
---

## `async*` と `yield`（非同期ジェネレータ関数）

**非同期ジェネレータ関数（`async*`）** を使用すると、複数の値を時間をかけて順番に生成・配信する `Stream` を手軽に構築できます。

* 関数宣言に `async*` を付け、戻り値型を `Stream<T>` にします。
* **`yield 値`**: データを1つストリームへ送出します。
* **`yield* 別のStream`**: 別のストリームの全イベントをそのまま中継して送出します。

```dart:async_generator.dart
// 1からcountまで1秒おきにカウントアップする非同期ジェネレータ
Stream<int> countStream(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(const Duration(milliseconds: 50));
    yield i; // データを1件送出
  }
}

void main() async {
  print('カウントダウン開始');
  await for (final number in countStream(3)) {
    print('カウント: $number');
  }
  print('完了！');
}
```

```dart-exec:async_generator.dart
カウントダウン開始
カウント: 1
カウント: 2
カウント: 3
完了！
```

> [!TIP]
> `StreamController` を手動で用意して `close()` を呼ぶ必要がないため、データの生成フローが明確な場合は `async*` と `yield` を使うのが最も安全でシンプルです。
