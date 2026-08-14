---
id: dart-async-stream-practice1
title: '練習問題1: async*を使ったカウントダウンストリーム'
level: 3
question:
  - async* 関数の中でループや条件分岐を組み合わせる方法を教えてください。
  - ストリームの途中でエラーを発生させたい場合はどう書きますか？
---

### 練習問題1: async*を使ったカウントダウンストリーム

指定された秒数から0までカウントダウンし、最後に `'発射！'` という文字列を通知するストリームを作成してください。

1. `Stream<String> countdown(int from)` を `async*` で定義する。
2. `from` から `1` までの数値をループし、50ミリ秒待機しながら `'$i...'` を `yield` する。
3. ループ終了後に `'発射！'` を `yield` する。
4. `main()` で `await for` を使って `countdown(3)` を購読し、結果を出力する。

```dart:practice10_1.dart
// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice10_1.dart
```
