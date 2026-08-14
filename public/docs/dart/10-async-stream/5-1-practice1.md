---
id: dart-async-stream-practice1
title: '練習問題1: async*を使ったカウントダウンストリーム'
level: 3
question:
  - async* 関数内で例外をスローするとストリームはどうなりますか？
  - await for ループを途中で break した場合の挙動を教えてください。
---

### 練習問題1: async*を使ったカウントダウンストリーム

指定された秒数からゼロまでカウントダウンするストリーム関数を作成してください。

1. `Stream<int> countdown(int from)` を `async*` で定義する。
2. `from` から `0` まで1ずつ減らしながら `yield` する（各ステップで `Future.delayed(Duration(milliseconds: 50))` を待つ）。
3. `main()` で `countdown(3)` を呼び出し、`await for` で受け取って `'残り: X秒'`、最後に `'カウントダウン終了！'` と出力する。

```dart:practice10_1.dart
// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice10_1.dart
```
