---
id: dart-collections-reduce-fold
title: reduce と fold による集計
level: 3
question:
  - reduce と fold の決定的な違いは何ですか？
  - 空リストに対して reduce を呼ぶとどうなりますか？
term:
  - reduce
  - fold
  - 畳み込み集計
---

### `reduce` と `fold` による集計

* `reduce`: リストの先頭要素を初期値として要素を1つの値にまとめます（空リストではエラー）。
* `fold`: 明示的な初期値を指定して集計を開始します（空リストでも安全、型変換も可能）。

```dart:reduce_fold.dart
void main() {
  final numbers = [10, 20, 30, 40];

  // reduce による合計
  final sum = numbers.reduce((acc, curr) => acc + curr);
  print('合計 (reduce): $sum');

  // fold による初期値 100 からの加算
  final totalWithBase = numbers.fold<int>(100, (acc, curr) => acc + curr);
  print('ベース値付き合計 (fold): $totalWithBase');

  // fold で文字列結合
  final joined = numbers.fold<String>('値:', (acc, curr) => '$acc $curr');
  print('文字列 (fold): $joined');
}
```

```dart-exec:reduce_fold.dart
合計 (reduce): 100
ベース値付き合計 (fold): 200
文字列 (fold): 値: 10 20 30 40
```
