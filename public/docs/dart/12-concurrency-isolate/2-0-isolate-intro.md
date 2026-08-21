---
id: dart-isolate-intro
title: Isolate の概念と Isolate.run() による別スレッド処理
level: 2
question:
  - Isolate.run() はどのような処理に向いていますか？
  - Isolate.run() に渡す関数に関する制約は何ですか？
term:
  - Isolate.run
  - compute
  - CPUバウンド
---

## `Isolate` の概念と `Isolate.run()` による別スレッド処理

Dart 2.19以降では、単発の重い計算処理（[[CPUバウンド]]タスク）を別スレッドで実行して結果を受け取るための **`Isolate.run()`** が導入されました。

内部で別Isolateの生成、計算の実行、結果メッセージの返却、そしてIsolateの破棄までを自動で行ってくれます（Flutterの `compute()` 関数と同等です）。

```dart:isolate_run_demo.dart
import 'dart:isolate';

// 別Isolateで実行される重い計算関数
int heavyCalculation(int count) {
  int sum = 0;
  for (int i = 0; i < count; i++) {
    sum += i;
  }
  return sum;
}

void main() async {
  print('メインスレッド開始');

  // 別スレッドで重い計算を実行
  final result = await Isolate.run(() => heavyCalculation(1000000));
  print('計算完了: $result');

  print('メインスレッド終了');
}
```

```dart-exec:isolate_run_demo.dart
メインスレッド開始
計算完了: 499999500000
メインスレッド終了
```
