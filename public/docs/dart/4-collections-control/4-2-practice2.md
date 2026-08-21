---
id: dart-collections-practice2
title: '練習問題2: 高階関数を使った集計処理'
level: 3
question:
  - foldメソッドの初期値の型と戻り値の型の関係を教えてください。
  - メソッドチェーンで可読性を保つインデントの書き方を教えてください。
---

### 練習問題2: 高階関数を使った集計処理

商品データのリストから条件に合う商品を抽出し、合計金額を算出するプログラムを作成してください。

1. 以下の商品リスト（`Map<String, dynamic>` のリスト）を用意する。
   ```dart
   final items = [
     {'name': 'ノートPC', 'price': 120000, 'inStock': true},
     {'name': 'マウス', 'price': 3000, 'inStock': false},
     {'name': 'キーボード', 'price': 15000, 'inStock': true},
     {'name': 'モニター', 'price': 45000, 'inStock': true},
   ];
   ```
2. `where` を使って在庫がある（`inStock == true`）商品のみに絞り込む。
3. `map` で各商品の価格（`price` as `int`）を取り出す。
4. `fold` を使って価格の総額を計算し、`'在庫あり商品の合計金額: xxx 円'` と出力する。

```dart:practice4_2.dart
void main() {
  // ここにコードを書いてください
}
```

```dart-exec:practice4_2.dart
```
