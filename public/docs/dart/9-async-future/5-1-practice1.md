---
id: dart-async-future-practice1
title: '練習問題1: 非同期データフェッチのシミュレーション'
level: 3
question:
  - Future.delayed を使ったモック関数の作成方法を教えてください。
  - 非同期関数が例外をスローした場合の try-catch の動作を復習したいです。
---

### 練習問題1: 非同期データフェッチのシミュレーション

サーバーからユーザーデータを非同期に取得する関数 `fetchUser` を作成してください。

1. `Future<Map<String, dynamic>> fetchUser(int id)` を定義する。
2. `Future.delayed(Duration(milliseconds: 100))` で遅延を発生させる。
3. `id <= 0` の場合は `Exception('無効なユーザーIDです: $id')` をスローする。
4. 正しいIDの場合は `{'id': id, 'name': 'User_$id', 'points': 1500}` を返す。
5. `main()` で正常系（`id: 1`）と異常系（`id: -1`）の呼び出しを `try-catch` で処理し、結果を出力する。

```dart:practice9_1.dart
// ここに関数を定義してください

void main() async {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice9_1.dart
```
