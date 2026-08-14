---
id: dart-records-patterns-practice1
title: '練習問題1: レコードを使った座標計算'
level: 3
question:
  - 名前付きフィールドを持つレコードの型注釈はどう書きますか？
  - レコードの分解代入時に型を明示することはできますか？
---

### 練習問題1: レコードを使った座標計算

2点間のマンハッタン距離と中点の座標を同時に計算して返す関数を作成してください。

1. 2次元座標を表すレコード型 `({int x, int y})` を引数として2つ受け取る関数 `analyzePoints` を定義する。
2. 戻り値として、マンハッタン距離 `distance`（$|x_1 - x_2| + |y_1 - y_2|$）と中点 `midpoint`（レコード `(double x, double y)`）を含む名前付きレコード `({int distance, (double, double) midpoint})` を返す。
3. `main()` で `p1 = (x: 0, y: 0)` と `p2 = (x: 4, y: 6)` を渡して呼び出し、分解代入で結果を受け取って出力する。

```dart:practice5_1.dart
// ここに関数を定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice5_1.dart
```
