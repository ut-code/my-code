---
id: dart-null-safety-practice2
title: '練習問題2: lateとNull認識演算子の活用'
level: 3
question:
  - late変数をクラス外のトップレベルで定義した場合も遅延評価されますか？
  - ??= 演算子を使ってキャッシュ処理を書く場合の注意点は何ですか？
---

### 練習問題2: lateとNull認識演算子の活用

設定マップの初期化と、値の取得・更新を行うプログラムを作成してください。

1. `late String appTitle` を定義し、初回アクセス時に `'My Dart App'` を生成する初期化式を記述する。
2. `Map<String, String>? config` 変数を `null` で定義する。
3. `??=` 演算子を使って、`config` が `null` の場合に `{'theme': 'dark'}` を代入する。
4. `appTitle` と `config` の中身を出力する。

```dart:practice2_2.dart
void main() {
  // ここにコードを書いてください
}
```

```dart-exec:practice2_2.dart
```
