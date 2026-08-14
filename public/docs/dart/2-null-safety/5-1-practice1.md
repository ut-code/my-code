---
id: dart-null-safety-practice1
title: '練習問題1: Null安全なデータ処理'
level: 3
question:
  - nullableなオブジェクトから安全に値を取り出すベストプラクティスは何ですか？
  - '?? 演算子を複数チェーンさせることはできますか？'
---

### 練習問題1: Null安全なデータ処理

ユーザープロフィールからメールアドレスのドメイン部分を取得し、取得できない場合はデフォルト値を返すプログラムを作成してください。

1. `String? email` を定義し、最初は `'user@example.com'` を代入する。
2. `email` が `null` の場合は `'ドメイン不明'` を返す安全な処理を書く。
   * ヒント: `email?.split('@').last ?? 'ドメイン不明'`
3. 次に `email = null` を代入し、再度同じ処理を実行して `'ドメイン不明'` が出力されることを確認する。

```dart:practice2_1.dart
void main() {
  // ここにコードを書いてください
}
```

```dart-exec:practice2_1.dart
```
