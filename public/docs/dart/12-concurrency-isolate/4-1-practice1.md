---
id: dart-concurrency-isolate-practice1
title: '練習問題1: Isolate.run()による重い計算の並行実行'
level: 3
question:
  - Isolate.run() 内で例外が発生した場合、呼び出し側はどう処理すべきですか？
  - 引数としてクロージャを渡す場合の変数キャプチャの注意点は何ですか？
---

### 練習問題1: Isolate.run()による重い計算の並行実行

素数の個数を数える計算を `Isolate.run()` を使って別スレッドで実行してください。

1. `bool isPrime(int n)` 関数を作成する（2以上の整数に対し素数判定を行う）。
2. `int countPrimes(int max)` 関数を作成し、`1` から `max` までの素数の総数をカウントする。
3. `main()` で `Isolate.run(() => countPrimes(50000))` を呼び出して非同期に結果を待機し、計算された素数の個数を出力する。

```dart:practice12_1.dart
import 'dart:isolate';

// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice12_1.dart
```
