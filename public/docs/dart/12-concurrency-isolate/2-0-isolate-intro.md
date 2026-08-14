---
id: dart-concurrency-isolate-run
title: Isolate の概念と Isolate.run() による別スレッド処理
level: 2
question:
  - Isolate.run() はどのような処理に向いていますか？
  - Isolate.run() に渡せる関数や引数にどのような制限がありますか？
  - compute() 関数（Flutter）と Isolate.run() の関係は何ですか？
term:
  - Isolate
  - Isolate.run
  - アイソレート
  - ヘビータスク
---

## `Isolate` の概念と `Isolate.run()` による別スレッド処理

Dart 2.19以降、単発の重い処理を別スレッドで実行して結果を受け取るための非常に手軽なAPI **`Isolate.run()`** が導入されました。

### `Isolate.run()` の使い方

`Isolate.run()` に実行したい関数（トップレベル関数、静的メソッド、あるいはクロージャ）を渡すだけで、自動的に新しいIsolateが立ち上がり、処理が完了すると結果を返して自動終了します。

```dart:isolate_run_demo.dart
import 'dart:isolate';

// 重い計算処理の例（大きな数値の合計）
int heavyCalculation(int count) {
  int total = 0;
  for (int i = 1; i <= count; i++) {
    total += i;
  }
  return total;
}

void main() async {
  print('1. メイン処理開始');

  // 別スレッド (Isolate) で重い処理をバックグラウンド実行
  final result = await Isolate.run(() => heavyCalculation(1000000));

  print('2. 計算完了: $result');
  print('3. メイン処理終了');
}
```

```dart-exec:isolate_run_demo.dart
1. メイン処理開始
2. 計算完了: 500000500000
3. メイン処理終了
```

> [!NOTE]
> `Isolate.run()` に渡す引数や戻り値はメッセージとして転送可能なオブジェクト（基本型、コレクション、または特定条件を満たすオブジェクト）である必要があります。
