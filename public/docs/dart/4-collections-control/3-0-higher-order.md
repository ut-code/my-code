---
id: dart-collections-higher-order
title: '高階関数によるデータ変換（map、where、reduce、fold）'
level: 2
question:
  - Iterable と List の関係は何ですか？
  - map や where の結果を List に変換するにはどうすればよいですか？
  - reduce と fold の違いは何ですか？
term:
  - 高階関数
  - map
  - where
  - reduce
  - fold
  - Iterable
  - toList
---

## 高階関数によるデータ変換（`map`、`where`、`reduce`、`fold`）

[[Dart]]のコレクション（`Iterable`）には、関数型プログラミングスタイルでデータを操作・集計するための便利な高階メソッドが用意されています。

### 1. `where` (フィルタリング) と `map` (要素変換)

* `where`: 条件を満たす（コールバックが `true` を返す）要素のみを抽出します。
* `map`: 各要素を変換関数で別の値に写像します。
* `toList()`: 遅延評価される `Iterable` を `List` に確定します。

```dart:map_where.dart
void main() {
  final numbers = [1, 2, 3, 4, 5, 6];

  // 偶数だけを抽出し、それぞれを2乗してListに変換
  final result = numbers
      .where((n) => n.isEven)
      .map((n) => n * n)
      .toList();

  print('元のリスト: $numbers');
  print('変換後: $result');
}
```

```dart-exec:map_where.dart
元のリスト: [1, 2, 3, 4, 5, 6]
変換後: [4, 16, 36]
```

### 2. `reduce` と `fold` (畳み込み集計)

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
