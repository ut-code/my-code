---
id: dart-functions-practice1
title: '練習問題1: 名前付き引数を持つ計算関数'
level: 3
question:
  - 名前付き引数でデフォルト値とrequiredを組み合わせることはできますか？
  - 消費税計算のような関数を設計する際のベストプラクティスを教えてください。
---

### 練習問題1: 名前付き引数を持つ計算関数

商品の税込金額を計算する関数 `calculateTotal` を作成してください。

1. 関数 `calculateTotal` は以下の引数を持ちます。
   * `price`: 商品本体価格（`int`, 必須の名前付き引数 `required`）
   * `taxRate`: 消費税率（`double`, デフォルト値 `0.10` の名前付き引数）
   * `discount`: 割引額（`int`, デフォルト値 `0` の名前付き引数）
2. 計算式: $(\text{price} - \text{discount}) \times (1.0 + \text{taxRate})$ の整数部分（`~/ 1` または `.toInt()`）を返す。
3. `main()` 関数で、デフォルト税率での計算と、割引・軽減税率（例: `taxRate: 0.08`）を指定した計算を実行して結果を出力する。

```dart:practice3_1.dart
// ここに関数を定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice3_1.dart
```
