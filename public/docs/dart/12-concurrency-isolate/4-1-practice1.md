---
id: dart-isolate-practice1
title: '練習問題1: Isolate.run()による重い計算の並行実行'
level: 3
question:
  - Isolate.run() で返せる戻り値の型にはどのような制約がありますか？
  - クロージャを Isolate.run() に渡す場合の注意点を教えてください。
---

### 練習問題1: Isolate.run()による重い計算の並行実行

巨大なリストのソートと集計処理を `Isolate.run()` を使って別スレッドで実行するプログラムを作成してください。

1. `List<int> generateAndSortNumbers(int size)` 関数を定義する。
   * 要素数 `size` のランダムな整数リストを生成し、降順ソートして先頭10件を返す。
2. `main()` で `await Isolate.run(() => generateAndSortNumbers(500000))` を呼び出す。
3. 取得した上位10件のリストを出力する。

```dart:practice12_1.dart
import 'dart:isolate';
import 'dart:math';

// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice12_1.dart
```
