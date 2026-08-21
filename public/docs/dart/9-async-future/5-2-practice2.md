---
id: dart-async-future-practice2
title: '練習問題2: 複数の非同期タスクの並行処理'
level: 3
question:
  - Future.wait で複数の異なる戻り値型を持つ処理をまとめる方法は？
  - 非同期処理を並行実行する際の例外ハンドリングの注意点は何ですか？
---

### 練習問題2: 複数の非同期タスクの並行処理

商品の価格情報と在庫情報を並行してフェッチし、合算結果を出力するプログラムを作成してください。

1. `Future<int> fetchPrice(String productId)`: 50ミリ秒後に価格 `3500` を返す。
2. `Future<int> fetchStock(String productId)`: 50ミリ秒後に在庫数 `12` を返す。
3. `main()` で `Future.wait` を使って2つの処理を同時に実行し、結果をレコードまたはリストとして受け取る。
4. `'商品ID: prod_abc, 価格: ¥3500, 在庫数: 12個'` と出力する。

```dart:practice9_2.dart
// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice9_2.dart
```
